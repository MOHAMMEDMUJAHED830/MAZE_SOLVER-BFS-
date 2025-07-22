from collections import deque

def solve_maze(maze, start=None, end=None):
    if not start:
        start = [0, 0]
    if not end:
        end = [len(maze)-1, len(maze[0])-1]
    
    rows, cols = len(maze), len(maze[0])
    directions = [(-1, 0), (1, 0), (0, -1), (0, 1)]
    
    # Validate positions
    if not (0 <= start[0] < rows and 0 <= start[1] < cols):
        raise ValueError("Start position out of bounds")
    if not (0 <= end[0] < rows and 0 <= end[1] < cols):
        raise ValueError("End position out of bounds")
    if maze[start[0]][start[1]] == 3:
        raise ValueError("Start position is a wall")
    if maze[end[0]][end[1]] == 3:
        raise ValueError("End position is a wall")

    queue = deque([(start[0], start[1], [])])
    visited = [[False for _ in range(cols)] for _ in range(rows)]
    visited[start[0]][start[1]] = True
    visited_order = []  # Track order of visited cells
    parent = {}  # Track path

    while queue:
        x, y, path = queue.popleft()
        visited_order.append((x, y))

        if [x, y] == end:
            # Reconstruct path
            full_path = path + [(x, y)]
            return {
                'path': full_path,
                'visited': visited_order,
                'maze': maze
            }

        for dx, dy in directions:
            nx, ny = x + dx, y + dy
            if 0 <= nx < rows and 0 <= ny < cols:
                if not visited[nx][ny] and maze[nx][ny] != 3:
                    visited[nx][ny] = True
                    queue.append((nx, ny, path + [(x, y)]))

    raise ValueError("No solution found")