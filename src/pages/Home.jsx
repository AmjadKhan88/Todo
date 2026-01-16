import Sidebar from "../components/Sidebar"
import TaskInput from "../components/TaskInput"

function Home() {
  

  return (
    <>
    <div className="container">
        <header>
            <h1>Advanced To-Do List</h1>
            <p className="tagline">Stay organized and boost your productivity</p>
        </header>
        
        <div className="app-container">
            {/* <!-- Sidebar with stats and filters --> */}
            <Sidebar/>
            
            {/* <!-- Main content with task input and list --> */}
           <TaskInput/>
        </div>
        
        <footer>
            <p>Advanced To-Do List &copy; 2023 | Track your tasks efficiently</p>
        </footer>
    </div>
         
        
</>
  )
}

export default Home
