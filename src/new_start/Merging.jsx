import { useEffect, useState } from "react"
import Button from "@mui/material/Button";
import ZoomOutIcon from '@mui/icons-material/ZoomOut';


const INITAL_TEAM_ORDER = ["Logistik", "Gatronomie", "Unterhaltung", "Vostand", "Musik"]

const INITIAL_TEAMS = {
    "Logistik": {
        "tasks": [
            "Aufbau-Plan",
            "Abbau-Plan",
            "Event-Setup"
        ]
    },
    "Gatronomie": {
        "tasks": [
            "Bar-Plan",
            "Getränkebestellung",
            "Bar-Setup"
        ]
    }, 
    "Unterhaltung": {
        "tasks": [
            "Rahmenprogramm planen",
            "Special Acts koordinieren",
            "Ideen finden",
            "Bier Pong Turnier"
        ]
    }, 
    "Musik": {
        "tasks": [
            "Bühnen-Konzept",
            "Musik-Konzept",
            "Musiker suchen",
            "Musiker anschreiben",
            "Timetable"
        ]
    }, 
    "Vostand": {
        "tasks": [
            "VA-Konzept",
            "Budget-Übersicht",
            "Verischerung",
            "Securities"
        ]
    },
}


const INITIAL_TASKS = {
  "Aufbau-Plan": {
    team: "Logistik",
    collapsed: false,
    milestones: ["Aufbau-Plan Konzept", "Aufbau-Plan Finish"],
  },
  "Abbau-Plan": {
    team: "Logistik",
    collapsed: false,
    milestones: ["Abbau-Plan Konzept", "Abbau-Plan Finish"],
  },
  "Event-Setup": {
    team: "Logistik",
    collapsed: false,
    milestones: ["Event-Setup Konzept", "Event-Setup Finish"],
  },

  "Bar-Plan": {
    team: "Gatronomie",
    collapsed: false,
    milestones: ["Bar-Plan Konzept", "Bar-Plan Finish"],
  },
  "Getränkebestellung": {
    team: "Gatronomie",
    collapsed: false,
    milestones: ["Getränkebestellung Konzept", "Getränkebestellung Finish"],
  },
  "Bar-Setup": {
    team: "Gatronomie",
    collapsed: false,
    milestones: ["Bar-Setup Konzept", "Bar-Setup Finish"],
  },

  "Rahmenprogramm planen": {
    team: "Unterhaltung",
    collapsed: false,
    milestones: ["Rahmenprogramm planen Konzept", "Rahmenprogramm planen Finish"],
  },
  "Special Acts koordinieren": {
    team: "Unterhaltung",
    collapsed: false,
    milestones: ["Special Acts koordinieren Konzept", "Special Acts koordinieren Finish"],
  },
  "Ideen finden": {
    team: "Unterhaltung",
    collapsed: false,
    milestones: ["Ideen finden Konzept", "Ideen finden Finish"],
  },
  "Bier Pong Turnier": {
    team: "Unterhaltung",
    collapsed: false,
    milestones: ["Bier Pong Turnier Konzept", "Bier Pong Turnier Finish"],
  },

  "Bühnen-Konzept": {
    team: "Musik",
    collapsed: false,
    milestones: ["Bühnen-Konzept Konzept", "Bühnen-Konzept Finish"],
  },
  "Musik-Konzept": {
    team: "Musik",
    collapsed: false,
    milestones: ["Musik-Konzept Konzept", "Musik-Konzept Finish"],
  },
  "Musiker suchen": {
    team: "Musik",
    collapsed: false,
    milestones: ["Musiker suchen Konzept", "Musiker suchen Finish"],
  },
  "Musiker anschreiben": {
    team: "Musik",
    collapsed: false,
    milestones: ["Musiker anschreiben Konzept", "Musiker anschreiben Finish"],
  },
  "Timetable": {
    team: "Musik",
    collapsed: false,
    milestones: ["Timetable Konzept", "Timetable Finish"],
  },

  "VA-Konzept": {
    team: "Vostand",
    collapsed: false,
    milestones: ["VA-Konzept Konzept", "VA-Konzept Finish"],
  },
  "Budget-Übersicht": {
    team: "Vostand",
    collapsed: false,
    milestones: ["Budget-Übersicht Konzept", "Budget-Übersicht Finish"],
  },
  "Verischerung": {
    team: "Vostand",
    collapsed: false,
    milestones: ["Verischerung Konzept", "Verischerung Finish"],
  },
  "Securities": {
    team: "Vostand",
    collapsed: false,
    milestones: ["Securities Konzept", "Securities Finish"],
  },
};


















// Compute Layout
const TEAM_HEIGHT = 150
const TEAM_WIDTH = 100

const TASK_WIDTH = 200
const TASK_HEIGHT = 50
const DAY_WIDTH = 50
const NUM_DAYS = 10

const MILESTONE_ROW_WIDTH = DAY_WIDTH * NUM_DAYS
const TASK_ROW_WIDTH = TASK_WIDTH + MILESTONE_ROW_WIDTH
const FULL_ROW_WIDTH = TASK_ROW_WIDTH + TEAM_WIDTH



// Adding position to teams
const positioned_teams = {}
for (let index in INITAL_TEAM_ORDER){
    const key = INITAL_TEAM_ORDER[index]
    const object = INITIAL_TEAMS[key]
    const computed_position = {
        x: 0,
        y: 0,
        height: 0,
        width: 0
    }
    positioned_teams[key] = {
        ...INITIAL_TEAMS[key],
        "position": computed_position,
    }
}
console.log("Positioned Teams: ", positioned_teams)




// Adding position to task
const positioned_Tasks = {}
for (let index in INITIAL_TASKS){
    
    positioned_Tasks[index] = {
        ...INITIAL_TASKS[index],
        position: {
            x: 0, 
            y: 0, 
            width: TASK_ROW_WIDTH,
            height: TASK_HEIGHT
        }
    }
}
console.log("Positioned TASKS: ", positioned_Tasks)















export default function Merging(){
    const [teamOrder, setTeamOrder] = useState(INITAL_TEAM_ORDER)
    const [teams, setTeams] = useState(positioned_teams)
    const [tasks, setTasks] = useState(positioned_Tasks)
    const [milestones, setMilestones] = useState({})
    const [days, setDays] = useState({})
    const [rebuildLayout, setRebuildLayout] = useState(0)





    const getDisplayedTeamTasks = (team_key) => {
        // console.log("CALLED CORRECTLY HERE", team_key)
        const raw_tasks = teams[team_key].tasks
        // console.log("the tasks", raw_tasks)
        const activeTasks = raw_tasks.filter(task => !tasks[task].collapsed)
        // console.log("Active Tasks", activeTasks)
        return activeTasks
    }





    
    // Layout Teams
    useEffect(()=>{
        


        // REBUILD TEAMS
        const newly_positioned_teams = {}
        let accumalted_height = 0
        for (let team_index = 0; team_index < teamOrder.length; team_index++) {
            const team_key = teamOrder[team_index]
            const team = teams[team_key]
            const active_tasks = getDisplayedTeamTasks(team_key).length
            const height_added = TASK_HEIGHT * active_tasks
            
            newly_positioned_teams[team_key] = {
                ...team,
                position: {
                    x: team.position.x,
                    y: accumalted_height,
                    width: FULL_ROW_WIDTH, 
                    height: height_added
                }
            }
            accumalted_height += height_added
        }
        console.log("NEWLY POSITIONED TEAMS: ", newly_positioned_teams)
        setTeams(newly_positioned_teams)

        

        const newly_postioned_tasks = {}
        console.log("UPDATING POSITION ACCORDINGLY")
        for (let task_key in tasks){
            console.log("TASK Name", task_key)
            const task = tasks[task_key]
            
            console.log("TASK HEREEEEEEEEEEE", task.collapsed)
            
            const visibleTasks = getDisplayedTeamTasks(task.team)

            const task_index_in_group = visibleTasks.indexOf(task_key)

            console.log("CURRENT INDEX: ", task_index_in_group)


            let height = TASK_HEIGHT * task_index_in_group

            if (task.collapsed) {height = 0}

            newly_postioned_tasks[task_key] = {
                ...tasks[task_key],
                position: {
                    ...tasks[task_key].position,
                    x: 0,
                    y: height
                }
            }
        }
        setTasks(newly_postioned_tasks)














        setRebuildLayout(false)
    },[rebuildLayout])






    return (
      <>
        <div className="h-screen p-10 bg-gray-500">
            <Button 
                onClick={()=>{setRebuildLayout(true)}}
                variant="contained" 
                color="error">
                Demo
            </Button>
          <div className="h-full w-full bg-white rounded relative">
            {Object.entries(teams).map(([team_key, team_data]) => {
                return (
                    <div 
                    className="absolute border"
                    style={{
                        backgroundColor: "#6aeaae",
                        top: `${team_data.position.y}px`,
                        left: `${team_data.position.x}px`,
                        height: `${team_data.position.height}px`,
                        width: `${team_data.position.width}px`,
                    }}
                    key={team_key}
                    >






                    {/* CONTENT */}
                    <div className="flex justify-between h-full">
                        {/* Team Name */}
                        <div
                        className="bg-red-200 relative "
                        style={{
                            width:`${FULL_ROW_WIDTH}px`
                        }}
                        >   
                             {team_key}
                        
                        </div>


                        {/* Tasks */}
                        <div
                        className="bg-blue-200 border-t absolute"
                        style={{
                            width: `${TASK_ROW_WIDTH}px`,
                            left: `${TEAM_WIDTH}px`
                            // paddingLeft: `${TEAM_WIDTH}px`ssdf
                        }}
                                    
                        >
                            {team_data.tasks.map((task_key)=>{
                                const task = tasks[task_key]

                                return (
                                    
                                    // PARENT TASK CONTAINER
                                    <div 
                                    key={`${task_key}_container`}
                                    className=" border-t absolute"
                                    style={{
                                        width: `${task.position.width}px`,
                                        top: `${task.position.y}px`
                                        // paddingLeft: `${TEAM_WIDTH}px`ssdf
                                    }}
                                    
                                    >



                                        {/* Task Name */}
                                        <div
                                        className="bg-white border-r relative"
                                        style={{
                                            display: tasks[task_key].collapsed ? "none" : "block",
                                            height: `${TASK_HEIGHT}px`,
                                            width: `${TASK_WIDTH}px`
                                        }}
                                        key={task_key}
                                        >
                                        
                                            {task_key}
                                         
                                                 <ZoomOutIcon
                                                 className="absolute top-1 right-1 text-sm! hover:text-blue-200!"
                                                 onClick={()=>{
                                                    setTasks((prev)=>{
                                                        return ({
                                                            ...prev,
                                                            [task_key]: {
                                                                ...prev[task_key],
                                                                collapsed: true
                                                            }
                                                        })
                                                    })
                                                setRebuildLayout(true)
                                                 }}
                                                 />
                                        </div>


                                        {/* Milestones */}
                                        <div 
                                        className="w-full bg-yellow-200 absolute border"
                                        style={{
                                            top: "0",
                                            left: `${TASK_WIDTH}px`,
                                            width: `${task.position.width - TASK_WIDTH}px`,
                                            height: `${TASK_HEIGHT}px`,
                                    
                                        }}
                                        
                                        >

                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>  
                   
                        
                    </div>
                )})}
          </div>
        </div>
      </>
    );
}





