<<<<<<< HEAD
from flask import Flask, request, jsonify
from flask_cors import CORS
from maze_solver import solve_maze

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return "Maze Solver API is running! Try POST /solve with maze data"

@app.route('/solve', methods=['POST', 'OPTIONS'])
def solve():
    if request.method == 'OPTIONS':
        response = jsonify({'status': 'ok'})
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Access-Control-Allow-Methods', 'POST')
        return response
    
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400
        
    maze = data.get('maze')
    if not maze:
        return jsonify({'error': 'Maze data is required'}), 400
        
    # Ensure start and end positions are set
    start = data.get('start', [0, 0])
    end = data.get('end', [len(maze)-1, len(maze[0])-1])
    
    try:
        solution = solve_maze(maze, start, end)
        return jsonify({
            'path': solution['path'],
            'visited': solution['visited'],
            'status': 'success'
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
=======
from flask import Flask, request, jsonify
from flask_cors import CORS
from maze_solver import solve_maze

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return "Maze Solver API is running! Try POST /solve with maze data"

@app.route('/solve', methods=['POST', 'OPTIONS'])
def solve():
    if request.method == 'OPTIONS':
        response = jsonify({'status': 'ok'})
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Access-Control-Allow-Methods', 'POST')
        return response
    
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400
        
    maze = data.get('maze')
    if not maze:
        return jsonify({'error': 'Maze data is required'}), 400
        
    # Ensure start and end positions are set
    start = data.get('start', [0, 0])
    end = data.get('end', [len(maze)-1, len(maze[0])-1])
    
    try:
        solution = solve_maze(maze, start, end)
        return jsonify({
            'path': solution['path'],
            'visited': solution['visited'],
            'status': 'success'
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
>>>>>>> 183685a091962c7f36b3b1569c33043573ba5346
    app.run(debug=True, port=5000, host='0.0.0.0')