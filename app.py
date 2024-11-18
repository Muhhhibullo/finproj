from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import heapq
import time
import threading

# Flask App Setup
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql+psycopg2://tsdbadmin:qnl9b586ja3e03lt@jkzc98lpmc.ckw17pu1w5.tsdb.cloud.timescale.com:31805/tsdb?sslmode=require'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Define the Order Model
class Order(db.Model):
    __tablename__ = 'orders'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)
    symbol = db.Column(db.String, nullable=False)
    order_type = db.Column(db.String, nullable=False)  # 'buy' or 'sell'
    price = db.Column(db.Float, nullable=False)
    quantity = db.Column(db.Float, nullable=False)
    timestamp = db.Column(db.BigInteger, default=lambda: int(time.time()))

# Initialize the database
db.create_all()

# OrderBook Logic
class OrderBook:
    def __init__(self):
        # Separate books for different symbols
        self.order_books = {}

    def add_order(self, order):
        if order.symbol not in self.order_books:
            self.order_books[order.symbol] = {'buy_orders': [], 'sell_orders': []}

        if order.order_type == 'buy':
            heapq.heappush(self.order_books[order.symbol]['buy_orders'], (-order.price, order.timestamp, order))
        else:
            heapq.heappush(self.order_books[order.symbol]['sell_orders'], (order.price, order.timestamp, order))

    def match_orders(self):
        matched_orders = []

        for symbol, books in self.order_books.items():
            while books['buy_orders'] and books['sell_orders']:
                buy_price, buy_timestamp, buy_order = books['buy_orders'][0]
                sell_price, sell_timestamp, sell_order = books['sell_orders'][0]

                # Check if prices match
                if -buy_price >= sell_price:
                    # Match orders
                    matched_quantity = min(buy_order.quantity, sell_order.quantity)
                    buy_order.quantity -= matched_quantity
                    sell_order.quantity -= matched_quantity

                    matched_orders.append({
                        'symbol': symbol,
                        'buy_order_id': buy_order.id,
                        'sell_order_id': sell_order.id,
                        'price': sell_price,
                        'quantity': matched_quantity
                    })

                    # Remove fully executed orders from the book
                    if buy_order.quantity == 0:
                        heapq.heappop(books['buy_orders'])
                    if sell_order.quantity == 0:
                        heapq.heappop(books['sell_orders'])
                else:
                    # No match
                    break

        return matched_orders

# Flask Routes
order_book = OrderBook()

@app.route('/add_order', methods=['POST'])
def add_order():
    data = request.json
    try:
        new_order = Order(
            user_id=data['user_id'],
            symbol=data['symbol'],
            order_type=data['order_type'],
            price=data['price'],
            quantity=data['quantity'],
            timestamp=int(time.time())
        )
        db.session.add(new_order)
        db.session.commit()

        # Add order to the order book for matching
        order_book.add_order(new_order)
        return jsonify({'message': 'Order added successfully', 'order_id': new_order.id}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/get_orders/<symbol>', methods=['GET'])
def get_orders(symbol):
    try:
        buy_orders = order_book.order_books.get(symbol, {}).get('buy_orders', [])
        sell_orders = order_book.order_books.get(symbol, {}).get('sell_orders', [])

        buy_orders_list = [{
            'price': -price,
            'timestamp': timestamp,
            'order_id': order.id,
            'user_id': order.user_id,
            'quantity': order.quantity
        } for price, timestamp, order in sorted(buy_orders, reverse=True)]

        sell_orders_list = [{
            'price': price,
            'timestamp': timestamp,
            'order_id': order.id,
            'user_id': order.user_id,
            'quantity': order.quantity
        } for price, timestamp, order in sorted(sell_orders)]

        return jsonify({'buy_orders': buy_orders_list, 'sell_orders': sell_orders_list}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/get_matched_orders', methods=['GET'])
def get_matched_orders():
    return jsonify({'matched_orders': matched_orders}), 200

# Background Matching Engine
matched_orders = []  # Global variable to store matched orders

def matching_engine():
    global matched_orders
    while True:
        time.sleep(2)
        matches = order_book.match_orders()
        if matches:
            matched_orders.extend(matches)
            print(f"Matched Orders: {matches}")  # Debug log to monitor matches

# Start the matching engine thread
threading.Thread(target=matching_engine, daemon=True).start()

if __name__ == '__main__':
    app.run(debug=True)
