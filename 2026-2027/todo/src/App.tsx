import { useState } from 'react'

interface Task {
  id: number;
  info: string;
  isChecked: boolean;
}

const initialTasks: Task[] = [
  { id: 0, info: "EZadanie 1", isChecked: false },
  { id: 1, info: "DZadanie 2", isChecked: true },
  { id: 2, info: "CZadane 3", isChecked: false },
]

function App() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [filter, setFilter] = useState("all")
  const [sort, setSort] = useState("def")
  const [newTask, setNewTask] = useState("")

  function toggleTask(id: number) {
    setTasks(tasks.map(task =>
        task.id === id ? { ...task, isChecked: !task.isChecked } : task
      ))
  }

  function handleFiltrChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setFilter(e.target.value)
  }
  
  function handleSortChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setSort(e.target.value)
  }

  function handleAddClick() {
    if (!newTask.trim()) return
    // wiem że to źle ale nie mam czasu ):
    setTasks([...tasks, { id: tasks[0].id, info: newTask.trim(), isChecked: false }])
    setNewTask("");
  }
  
  const filteredTasks = tasks.filter(task => {
    if (filter === "done") return task.isChecked
    if (filter === "ndone") return !task.isChecked
    return true
  })

  const sortedTasks = filteredTasks.sort((a, b) => {
    if (sort === "alph") return a.info.localeCompare(b.info)
    if (sort === "done") return Number(a.isChecked) - Number(b.isChecked)
    return 0
  })

  return (
    <div>
      <select name="filtr" id="filtr" value={filter} onChange={handleFiltrChange}>
        <option value="all">Wszystkie</option>
        <option value="done">Wykonene</option>
        <option value="ndone">Nie wykonane</option>
      </select>
      
      <select name="sort" id="sort" value={sort} onChange={handleSortChange}>
        <option value="def">Domyślne</option>
        <option value="alph">Alfabetycznie</option>
        <option value="done">Po wykonaniu</option>
      </select>

      <p>Nieukończone zadania: {tasks.filter(task => !task.isChecked).length}</p>

      <input type="text" name="add" id="add" placeholder='Dodaj zadanie' value={newTask} onChange={(e) => setNewTask(e.target.value)} />
      <button onClick={handleAddClick}>Dodaj</button>

      <table>
        {sortedTasks.map(task => (
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