import './styles.css';
import Maze from './components/Maze';

function App() {
  return (
    <div className="App">
      <h1>Maze Solver with BFS</h1>
      <Maze size={15} />
    </div>
  );
}

export default App;