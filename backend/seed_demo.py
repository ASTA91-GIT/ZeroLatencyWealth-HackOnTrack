"""Safe Demo Seeding Script for ZeroLatency Wealth.
Can be executed as: python -m backend.seed_demo
"""
import sys
from backend.database import init_db, seed_demo_data

def main():
    print("ZeroLatency Wealth: Initializing schema...")
    init_db()
    print("ZeroLatency Wealth: Seeding benchmark demo data...")
    seed_demo_data(force=True)
    print("Success: Demo benchmark portfolio (~Rs 8,42,500) and master assets seeded successfully.")

if __name__ == "__main__":
    main()
