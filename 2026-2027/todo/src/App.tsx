import { useState } from 'react'

interface Task {
  id: number;
  info: string;
  isChecked: boolean;
}

const initialTasks: Task[] = [
  { id: 0, info: "Zadanie 1", isChecked: false },
  { id: 1, info: "Zadanie 2", isChecked: true },
  { id: 2, info: "Zadane 3", isChecked: false },
]

function App() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)

  function toggleTask(id: number) {
    setTasks(tasks.map(task =>
        task.id === id ? { ...task, isChecked: !task.isChecked } : task
      ))
  }

  return (
    <div>
      <p>Nieukończone zadania: {tasks.filter(task => !task.isChecked).length}</p>

      <table>
        {tasks.map(task => (
          <tr key={task.id}>
            <td>
              <input type="checkbox" checked={task.isChecked} onChange={() => toggleTask(task.id)}/>
            </td>
            <td>{task.info}</td>
          </tr>
        ))}
      </table>
    </div>
  )
}

export default App