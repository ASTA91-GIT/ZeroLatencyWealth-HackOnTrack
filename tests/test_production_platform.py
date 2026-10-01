import os
import sys
import pytest
import uuid

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_health_check():
    """Verify system health endpoint (Requirement #46)."""
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["app"] == "ZeroLatency Wealth"
    assert "database" in data["services"]

def test_ai_health_check():
    """Verify internal local AI health endpoint (Requirement #47)."""
    response = client.get("/api/ai/health")
    assert response.status_code == 200
    data = response.json()
    assert "provider" in data
    assert data["provider"] == "ollama"
    assert "status" in data

def test_public_markets_explorer_without_auth():
    """Verify market overview and quotes are publicly accessible (Requirement #1, #2)."""
    # 1. Market overview
    res_ov = client.get("/api/markets/overview")
    assert res_ov.status_code == 200
    ov_data = res_ov.json()
    assert "indices" in ov_data
    assert len(ov_data["indices"]) >= 3
    assert "market_status" in ov_data

    # 2. Quotes list
    res_q = client.get("/api/markets/quotes")
    assert res_q.status_code == 200
    quotes = res_q.json()
    assert len(quotes) > 0
    first_q = quotes[0]
    assert "symbol" in first_q
    assert "last_price" in first_q or "price" in first_q
    assert "asset_type" in first_q

    # 3. Filter by category
    res_reit = client.get("/api/markets/quotes?asset_type=REIT")
    assert res_reit.status_code == 200
    reit_quotes = res_reit.json()
    assert all(q["asset_type"] == "REIT" for q in reit_quotes)

def test_demo_auth_flow():
    """Verify hackathon demo mode 1-click authentication remains fully functional (Requirement #14, #52)."""
    res = client.post("/api/auth/demo")
    assert res.status_code == 200
    data = res.json()
    assert data["user"]["is_demo"] is True
    assert data["user"]["id"] == "demo-user-001"
    assert "token" in data

    token = data["token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Verify benchmark portfolio summary is accessible
    res_sum = client.get("/api/portfolio/summary", headers=headers)
    assert res_sum.status_code == 200
    sum_data = res_sum.json()
    assert sum_data["total_value"] > 800000.0
    assert sum_data["is_demo"] is True

def test_real_user_registration_login_and_isolation():
    """Verify Argon2id user registration, authentication, and strict data isolation (Requirements #4, #5, #6, #12)."""
    unique_email = f"investor_{uuid.uuid4().hex[:6]}@zerolatency.test"
    password = "Argon2ProductionPassword#99"

    # 1. Registration
    reg_res = client.post("/api/auth/register", json={
        "name": "Sarah Connor",
        "email": unique_email,
        "password": password
    })
    assert reg_res.status_code == 200
    reg_data = reg_res.json()
    assert reg_data["user"]["email"] == unique_email
    assert reg_data["user"]["is_demo"] is False
    assert "token" in reg_data

    user_token = reg_data["token"]
    user_headers = {"Authorization": f"Bearer {user_token}"}

    # 2. Get Profile (/api/auth/me)
    me_res = client.get("/api/auth/me", headers=user_headers)
    assert me_res.status_code == 200
    me_data = me_res.json()
    assert me_data["email"] == unique_email

    # 3. Data Isolation Check: New user must start with clean empty holdings
    holdings_res = client.get("/api/portfolio", headers=user_headers)
    assert holdings_res.status_code == 200
    assert len(holdings_res.json()) == 0

    # 4. Login with Argon2id
    login_res = client.post("/api/auth/login", json={
        "email": unique_email,
        "password": password
    })
    assert login_res.status_code == 200
    assert "token" in login_res.json()

    # 5. Invalid password must be rejected
    bad_login = client.post("/api/auth/login", json={
        "email": unique_email,
        "password": "WrongPassword123"
    })
    assert bad_login.status_code == 401

def test_watchlist_service():
    """Verify watchlist persistence per authenticated user (Requirement #25)."""
    demo_login = client.post("/api/auth/demo").json()
    headers = {"Authorization": f"Bearer {demo_login['token']}"}

    # Add EQ01 to watchlist
    add_res = client.post("/api/watchlist/EQ01", headers=headers)
    assert add_res.status_code == 200

    # List watchlist
    list_res = client.get("/api/watchlist", headers=headers)
    assert list_res.status_code == 200
    items = list_res.json()
    assert any(item["symbol"] == "NIFTYBEES" or item["asset_id"] == "EQ01" for item in items)

    # Remove from watchlist
    del_res = client.delete("/api/watchlist/EQ01", headers=headers)
    assert del_res.status_code == 200

def test_paper_trading_execution_and_portfolio_update():
    """Verify simulated paper trading flow, cash balance checks, and portfolio recalculation (Requirement #26)."""
    unique_email = f"trader_{uuid.uuid4().hex[:6]}@zerolatency.test"
    reg_data = client.post("/api/auth/register", json={
        "name": "David Miller",
        "email": unique_email,
        "password": "StrongPassword#2026"
    }).json()
    headers = {"Authorization": f"Bearer {reg_data['token']}"}

    # 1. Check Initial Paper Account Buying Power (Rs 10,00,000)
    acc_res = client.get("/api/paper-trading/account", headers=headers)
    assert acc_res.status_code == 200
    acc_data = acc_res.json()
    assert acc_data["cash_balance"] == 1000000.0
    assert acc_data["is_simulated"] is True

    # 2. Execute Paper BUY order (10 units of NIFTYBEES)
    buy_res = client.post("/api/paper-trading/order", headers=headers, json={
        "asset_id": "EQ01",
        "order_type": "BUY",
        "units": 10
    })
    assert buy_res.status_code == 200
    buy_data = buy_res.json()
    assert buy_data["success"] is True
    assert buy_data["status"] == "FILLED"
    assert buy_data["remaining_cash"] < 1000000.0
    assert buy_data["is_simulated"] is True

    # 3. Check that user's holdings now reflect the bought asset
    holdings_res = client.get("/api/portfolio", headers=headers)
    assert holdings_res.status_code == 200
    holdings = holdings_res.json()
    assert len(holdings) == 1
    assert holdings[0]["symbol"] == "NIFTYBEES"
    assert holdings[0]["units"] == 10.0

    # 4. Check paper orders history
    orders_res = client.get("/api/paper-trading/orders", headers=headers)
    assert orders_res.status_code == 200
    orders = orders_res.json()
    assert len(orders) >= 1
    assert orders[0]["order_type"] == "BUY"

def test_local_ai_copilot_conversational_response():
    """Verify local AI copilot answers arbitrary financial questions and maintains safety guardrails (Requirements #15 - #20)."""
    # 1. Arbitrary financial concept question
    chat_res = client.post("/api/copilot/chat", json={
        "message": "What is a REIT and why do they distribute 90% of cash flows?",
    })
    assert chat_res.status_code == 200
    data = chat_res.json()
    assert "reply" in data
    assert len(data["reply"]) > 50
    assert "disclaimer" in data
    assert "source" in data

    # 2. Portfolio allocation question
    demo_login = client.post("/api/auth/demo").json()
    headers = {"Authorization": f"Bearer {demo_login['token']}"}

    port_chat = client.post("/api/copilot/chat", headers=headers, json={
        "message": "Explain my current portfolio allocation and yields",
        "conversation_history": [
            {"role": "user", "content": "Hello Copilot"}
        ]
    })
    assert port_chat.status_code == 200
    port_data = port_chat.json()
    assert "reply" in port_data

def test_csv_upload_validation():
    """Verify secure CSV parsing and input validation (Requirements #37, #38)."""
    demo_login = client.post("/api/auth/demo").json()
    headers = {"Authorization": f"Bearer {demo_login['token']}"}

    valid_csv = "Symbol,Name,AssetType,Units,BuyPrice,CurrentPrice\nTATAINVEST,Tata Investment Corp,EQUITY,10,6500.0,6820.0"
    files = {"file": ("test_portfolio.csv", valid_csv, "text/csv")}

    upload_res = client.post("/api/import/csv", headers=headers, files=files)
    assert upload_res.status_code == 200
    data = upload_res.json()
    assert data["status"] == "success"
    assert data["imported_count"] == 1
