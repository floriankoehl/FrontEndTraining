import { useEffect, useState } from "react"
import Button from "@mui/material/Button";
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import GradeIcon from '@mui/icons-material/Grade';
import { width } from "@mui/system";


const INITAL_TEAM_ORDER = ["Logistik", "Gatronomie", "Unterhaltung", "Vostand", "Musik"]

// const INITIAL_TEAMS = {
//     "Logistik": {
//         "tasks": [
//             "Aufbau-Plan",
//             "Abbau-Plan",
//             "Event-Setup"
//         ]
//     },
//     "Gatronomie": {
//         "tasks": [
//             "Bar-Plan",
//             "Getränkebestellung",
//             "Bar-Setup"
//         ]
//     }, 
//     "Unterhaltung": {
//         "tasks": [
//             "Rahmenprogramm planen",
//             "Special Acts koordinieren",
//             "Ideen finden",
//             "Bier Pong Turnier"
//         ]
//     }, 
//     "Musik": {
//         "tasks": [
//             "Bühnen-Konzept",
//             "Musik-Konzept",
//             "Musiker suchen",
//             "Musiker anschreiben",
//             "Timetable"
//         ]
//     }, 
//     "Vostand": {
//         "tasks": [
//             "VA-Konzept",
//             "Budget-Übersicht",
//             "Verischerung",
//             "Securities"
//         ]
//     },
// }
const INITIAL_TEAMS = {
  "Logistik": {
    color: "#3B82F6", // soft blue
    tasks: [
      "Aufbau-Plan",
      "Abbau-Plan",
      "Event-Setup"
    ]
  },
  "Gatronomie": {
    color: "#F59E0B", // warm amber
    tasks: [
      "Bar-Plan",
      "Getränkebestellung",
      "Bar-Setup"
    ]
  },
  "Unterhaltung": {
    color: "#8B5CF6", // muted violet
    tasks: [
      "Rahmenprogramm planen",
      "Special Acts koordinieren",
      "Ideen finden",
      "Bier Pong Turnier"
    ]
  },
  "Musik": {
    color: "#10B981", // modern emerald
    tasks: [
      "Bühnen-Konzept",
      "Musik-Konzept",
      "Musiker suchen",
      "Musiker anschreiben",
      "Timetable"
    ]
  },
  "Vostand": {
    color: "#EF4444", // clean soft red (not aggressive)
    tasks: [
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


const INITIAL_MILESTONES = {
  "Aufbau-Plan Konzept": {
    task: "Aufbau-Plan",
    order_number: 0,
    incoming_edges: [],
    outgoing_edges: [],
  },
  "Aufbau-Plan Finish": {
    task: "Aufbau-Plan",
    order_number: 1,
    incoming_edges: [],
    outgoing_edges: [],
  },

  "Abbau-Plan Konzept": {
    task: "Abbau-Plan",
    order_number: 0,
    incoming_edges: [],
    outgoing_edges: [],
  },
  "Abbau-Plan Finish": {
    task: "Abbau-Plan",
    order_number: 1,
    incoming_edges: [],
    outgoing_edges: [],
  },

  "Event-Setup Konzept": {
    task: "Event-Setup",
    order_number: 0,
    incoming_edges: [],
    outgoing_edges: [],
  },
  "Event-Setup Finish": {
    task: "Event-Setup",
    order_number: 1,
    incoming_edges: [],
    outgoing_edges: [],
  },

  "Bar-Plan Konzept": {
    task: "Bar-Plan",
    order_number: 0,
    incoming_edges: [],
    outgoing_edges: [],
  },
  "Bar-Plan Finish": {
    task: "Bar-Plan",
    order_number: 1,
    incoming_edges: [],
    outgoing_edges: [],
  },

  "Getränkebestellung Konzept": {
    task: "Getränkebestellung",
    order_number: 0,
    incoming_edges: [],
    outgoing_edges: [],
  },
  "Getränkebestellung Finish": {
    task: "Getränkebestellung",
    order_number: 1,
    incoming_edges: [],
    outgoing_edges: [],
  },

  "Bar-Setup Konzept": {
    task: "Bar-Setup",
    order_number: 0,
    incoming_edges: [],
    outgoing_edges: [],
  },
  "Bar-Setup Finish": {
    task: "Bar-Setup",
    order_number: 1,
    incoming_edges: [],
    outgoing_edges: [],
  },

  "Rahmenprogramm planen Konzept": {
    task: "Rahmenprogramm planen",
    order_number: 0,
    incoming_edges: [],
    outgoing_edges: [],
  },
  "Rahmenprogramm planen Finish": {
    task: "Rahmenprogramm planen",
    order_number: 1,
    incoming_edges: [],
    outgoing_edges: [],
  },

  "Special Acts koordinieren Konzept": {
    task: "Special Acts koordinieren",
    order_number: 0,
    incoming_edges: [],
    outgoing_edges: [],
  },
  "Special Acts koordinieren Finish": {
    task: "Special Acts koordinieren",
    order_number: 1,
    incoming_edges: [],
    outgoing_edges: [],
  },

  "Ideen finden Konzept": {
    task: "Ideen finden",
    order_number: 0,
    incoming_edges: [],
    outgoing_edges: [],
  },
  "Ideen finden Finish": {
    task: "Ideen finden",
    order_number: 1,
    incoming_edges: [],
    outgoing_edges: [],
  },

  "Bier Pong Turnier Konzept": {
    task: "Bier Pong Turnier",
    order_number: 0,
    incoming_edges: [],
    outgoing_edges: [],
  },
  "Bier Pong Turnier Finish": {
    task: "Bier Pong Turnier",
    order_number: 1,
    incoming_edges: [],
    outgoing_edges: [],
  },

  "Bühnen-Konzept Konzept": {
    task: "Bühnen-Konzept",
    order_number: 0,
    incoming_edges: [],
    outgoing_edges: [],
  },
  "Bühnen-Konzept Finish": {
    task: "Bühnen-Konzept",
    order_number: 1,
    incoming_edges: [],
    outgoing_edges: [],
  },

  "Musik-Konzept Konzept": {
    task: "Musik-Konzept",
    order_number: 0,
    incoming_edges: [],
    outgoing_edges: [],
  },
  "Musik-Konzept Finish": {
    task: "Musik-Konzept",
    order_number: 1,
    incoming_edges: [],
    outgoing_edges: [],
  },

  "Musiker suchen Konzept": {
    task: "Musiker suchen",
    order_number: 0,
    incoming_edges: [],
    outgoing_edges: [],
  },
  "Musiker suchen Finish": {
    task: "Musiker suchen",
    order_number: 1,
    incoming_edges: [],
    outgoing_edges: [],
  },

  "Musiker anschreiben Konzept": {
    task: "Musiker anschreiben",
    order_number: 0,
    incoming_edges: [],
    outgoing_edges: [],
  },
  "Musiker anschreiben Finish": {
    task: "Musiker anschreiben",
    order_number: 1,
    incoming_edges: [],
    outgoing_edges: [],
  },

  "Timetable Konzept": {
    task: "Timetable",
    order_number: 0,
    incoming_edges: [],
    outgoing_edges: [],
  },
  "Timetable Finish": {
    task: "Timetable",
    order_number: 1,
    incoming_edges: [],
    outgoing_edges: [],
  },

  "VA-Konzept Konzept": {
    task: "VA-Konzept",
    order_number: 0,
    incoming_edges: [],
    outgoing_edges: [],
  },
  "VA-Konzept Finish": {
    task: "VA-Konzept",
    order_number: 1,
    incoming_edges: [],
    outgoing_edges: [],
  },

  "Budget-Übersicht Konzept": {
    task: "Budget-Übersicht",
    order_number: 0,
    incoming_edges: [],
    outgoing_edges: [],
  },
  "Budget-Übersicht Finish": {
    task: "Budget-Übersicht",
    order_number: 1,
    incoming_edges: [],
    outgoing_edges: [],
  },

  "Verischerung Konzept": {
    task: "Verischerung",
    order_number: 0,
    incoming_edges: [],
    outgoing_edges: [],
  },
  "Verischerung Finish": {
    task: "Verischerung",
    order_number: 1,
    incoming_edges: [],
    outgoing_edges: [],
  },

  "Securities Konzept": {
    task: "Securities",
    order_number: 0,
    incoming_edges: [],
    outgoing_edges: [],
  },
  "Securities Finish": {
    task: "Securities",
    order_number: 1,
    incoming_edges: [],
    outgoing_edges: [],
  },
};














// Compute Layout
const TEAM_HEIGHT = 150
const TEAM_WIDTH = 100

const TASK_WIDTH = 200
const TASK_HEIGHT = 50
const DAY_WIDTH = 50
const NUM_DAYS = 30

const MILESTONE_ROW_WIDTH = DAY_WIDTH * NUM_DAYS
const TASK_ROW_WIDTH = TASK_WIDTH + MILESTONE_ROW_WIDTH
const FULL_ROW_WIDTH = TASK_ROW_WIDTH + TEAM_WIDTH


const MARGIN_TEAM = 20









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




// Add position to Milestone
const adapted_Milestones = {}
for (let key in INITIAL_MILESTONES){
    // console.log("The key", key)
    const milestone = INITIAL_MILESTONES[key]
    // console.log("The milestone", milestone)
    adapted_Milestones[key] = {
        ...milestone,
        position: {
            x: 0, 
            y: 0, 
            height: TASK_HEIGHT, 
            width: DAY_WIDTH
        }
    }
}
console.log("adapted Milestones: ", adapted_Milestones)









export default function Merging(){
    const [teamOrder, setTeamOrder] = useState(INITAL_TEAM_ORDER)
    const [teams, setTeams] = useState(positioned_teams)
    const [tasks, setTasks] = useState(positioned_Tasks)
    const [milestones, setMilestones] = useState(adapted_Milestones)
    const [days, setDays] = useState({})
    const [rebuildLayout, setRebuildLayout] = useState(0)
    const [totalHeight, setTotalHeight] = useState(100)





    const getDisplayedTeamTasks = (team_key) => {
        // console.log("CALLED CORRECTLY HERE", team_key)
        const raw_tasks = teams[team_key].tasks
        // console.log("the tasks", raw_tasks)
        const activeTasks = raw_tasks.filter(task => !tasks[task].collapsed)
        // console.log("Active Tasks", activeTasks)
        return activeTasks
    }

    // Layout Grid
    useEffect(()=>{
        // REBUILD TEAMS
        const newly_positioned_teams = {}
        let accumalted_height = 0
        for (let team_index = 0; team_index < teamOrder.length; team_index++) {
            const team_key = teamOrder[team_index]
            const team = teams[team_key]
            const active_tasks = getDisplayedTeamTasks(team_key).length
            const height_added = TASK_HEIGHT * active_tasks + MARGIN_TEAM
            
            newly_positioned_teams[team_key] = {
                ...team,
                position: {
                    x: team.position.x,
                    y: accumalted_height ,
                    width: FULL_ROW_WIDTH, 
                    height: height_added
                }
            }
            accumalted_height += height_added
        }
        // console.log("NEWLY POSITIONED TEAMS: ", newly_positioned_teams)
        setTeams(newly_positioned_teams)
        setTotalHeight(accumalted_height)
        console.log("ACUMALTED HEIGHT", accumalted_height)
        

        const newly_postioned_tasks = {}
        // console.log("UPDATING POSITION ACCORDINGLY")
        for (let task_key in tasks){
            // console.log("TASK Name", task_key)
            const task = tasks[task_key]
            
            // console.log("TASK HEREEEEEEEEEEE", task.collapsed)
            
            const visibleTasks = getDisplayedTeamTasks(task.team)

            const task_index_in_group = visibleTasks.indexOf(task_key)

            // console.log("CURRENT INDEX: ", task_index_in_group)


            let height = TASK_HEIGHT * task_index_in_group + MARGIN_TEAM /2

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




        const newly_positioned_milestones = {}
        for (let milestone_key in milestones) {
            // console.log("Milestone key: ", milestone_key)
            const milestone = milestones[milestone_key]
            // console.log("Milestone: ", milestone)
            newly_positioned_milestones[milestone_key] = {
                ...milestone, 
                position: {
                    ...milestone.position,
                    x: DAY_WIDTH * milestone.order_number 
                }
            }
        }
        console.log("NEWLY Positoned Milestones", newly_positioned_milestones)
        setMilestones(newly_positioned_milestones)









        const positioned_days = {}
        for (let i = 0; i < NUM_DAYS; i++ ){
            positioned_days[i] = {
                x: DAY_WIDTH * i + TEAM_WIDTH + TASK_WIDTH, 
                y: 0, 
                height: accumalted_height,
                width: DAY_WIDTH,
                
            }
        }
        console.log("POsitioned days: ", positioned_days)
        setDays(positioned_days)





        setRebuildLayout(false)
    },[rebuildLayout])



    const handleMilestoneDrag = (event, milestone_key) => {
        event.stopPropagation()
        const startX = event.clientX - milestones[milestone_key].position.x
        const startY = event.clientY - milestones[milestone_key].position.y
        console.log("STARTX, STARTY: ", startX, startY)
        let new_x = startX

        const handleMouseMoveMilestone = (event) => {
            new_x = event.clientX - startX
            const new_y = event.clientY - startY


            if (new_x < 0) {
                new_x = 0
            }
            if (new_x + milestones[milestone_key].position.width > TASK_ROW_WIDTH - TASK_WIDTH) {
                new_x = TASK_ROW_WIDTH - TASK_WIDTH - milestones[milestone_key].position.width
            }
            
            console.log("New X and New Y: ", new_x, new_y)
            setMilestones((prev)=>{
                return ({
                    ...prev, 
                    [milestone_key]: {
                        ...prev[milestone_key], 
                        position: {
                            ...prev[milestone_key].position,
                            x: new_x
                        }
                    }
                })
            })
        }

        const handleMouseUpMilestone = () => {
            const snappedX = Math.round(new_x / DAY_WIDTH) * DAY_WIDTH
            const new_index = snappedX / DAY_WIDTH
            console.log("SNAPPED: ", snappedX, new_index)
            setMilestones((prev)=>{
                return ({
                    ...prev, 
                    [milestone_key]: {
                        ...prev[milestone_key], 
                        order_number: new_index,
                        position: {
                            ...prev[milestone_key].position,
                            x: snappedX
                        }
                    }
                })
            })




            document.removeEventListener("mousemove", handleMouseMoveMilestone)
            document.removeEventListener("mouseup", handleMouseUpMilestone)
        }


        document.addEventListener("mousemove", handleMouseMoveMilestone)
        document.addEventListener("mouseup", handleMouseUpMilestone)
    }









    return (
      <>
        <div className="h-2000 p-10 bg-gray-500">
            <Button 
                onClick={()=>{setRebuildLayout(true)}}
                variant="contained" 
                color="error">
                Demo
            </Button>
          <div className="h-full w-full bg-white rounded relative">




            {/* DAYS */}
            {Object.entries(days).map(([day, position])=>{

                // FOR SOME REASON THE POSITION IS CORRECT; DONT ASK ME WHYX
                // console.log("THE DAYS", position)
                return (
                    <div
                    className="absolute border pointer-events-none"
                    style={{
                        top: `${position.y}px`,
                        left: `${position.x}px`,
                        width: `${position.width}px`,
                        height: `${position.height}px`,
                        zIndex: 500,
         

                    }}
                    key={`day_${day}`}
                    >
                       
                    </div>
                )
            })}









            {/* TEAMS -> TASKS -> MILESTONES CONTAINER */}
            {Object.entries(teams).map(([team_key, team_data]) => {
                return (
                  <div
                    className="absolute border-t"
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
                        className=" relative flex flex-col"
                        style={{
                          width: `${FULL_ROW_WIDTH}px`,
                          backgroundColor: `${team_data.color}`
                        }}
                      >
                        {team_key}
                        <Button
                          className="h-5 w-10 text-xs!"
                          onClick={() => {
                            setTasks((prev) => {
                              const updatedTasks = { ...prev };

                              teams[team_key].tasks.forEach((task_key) => {
                                updatedTasks[task_key] = {
                                  ...updatedTasks[task_key],
                                  collapsed: false,
                                };
                              });

                              return updatedTasks;
                            });

                            setRebuildLayout(true);
                          }}
                          variant="contained"
                          color="error"
                        >
                          All
                        </Button>
                        <Button
                          className="h-5 w-10 text-xs!"
                          onClick={() => {
                            setTeamOrder((prev) => {
                              const filtered = prev.filter((t) => t !== team_key);
                              return [team_key, ...filtered];
                            });
                            setRebuildLayout(true);
                          }}
                          variant="contained"
                          color="primary"
                        >
                          Top
                        </Button>
                      </div>

                      {/* Tasks */}
                      <div
                        className="bg-blue-200  absolute"
                        style={{
                          width: `${FULL_ROW_WIDTH}px`,
                          left: `${TEAM_WIDTH}px`,
                          // paddingLeft: `${TEAM_WIDTH}px`ssdf
                        }}
                      >
                        {team_data.tasks.map((task_key) => {
                          const task = tasks[task_key];

                          return (
                            // PARENT TASK CONTAINER
                            <div
                              key={`${task_key}_container`}
                              className=" border-t absolute"
                              style={{
                                width: `${task.position.width}px`,
                                top: `${task.position.y}px`,
                                // paddingLeft: `${TEAM_WIDTH}px`ssdf
                              }}
                            >
                              {/* Task Name */}
                              <div
                                className="bg-gray-200  border-r relative"
                                style={{
                                  display: tasks[task_key].collapsed
                                    ? "none"
                                    : "block",
                                  height: `${TASK_HEIGHT}px`,
                                  width: `${TASK_WIDTH}px`,
                                }}
                                key={task_key}
                              >
                                {task_key}

                                <div className="absolute top-1 right-1 flex gap-1">
                                  <GradeIcon
                                    className="text-sm! hover:text-yellow-500! cursor-pointer"
                                    onClick={() => {
                                      setTeams((prev) => {
                                        const currentTasks = [...prev[team_key].tasks];
                                        const taskIndex = currentTasks.indexOf(task_key);
                                        if (taskIndex > 0) {
                                          currentTasks.splice(taskIndex, 1);
                                          currentTasks.unshift(task_key);
                                        }
                                        return {
                                          ...prev,
                                          [team_key]: {
                                            ...prev[team_key],
                                            tasks: currentTasks,
                                          },
                                        };
                                      });
                                      setRebuildLayout(true);
                                    }}
                                  />
                                  <ZoomOutIcon
                                    className="text-sm! hover:text-blue-200! cursor-pointer"
                                    onClick={() => {
                                      setTasks((prev) => {
                                        return {
                                          ...prev,
                                          [task_key]: {
                                            ...prev[task_key],
                                            collapsed: true,
                                          },
                                        };
                                      });
                                      setRebuildLayout(true);
                                    }}
                                  />
                                </div>
                              </div>

                              {/* Milestones */}
                              <div
                                className="bg-gray-200 w-full absolute border select-none"
                                style={{
                                  display: tasks[task_key].collapsed ? "none" : "block",
                                  top: "0",
                                  left: `${TASK_WIDTH}px`,
                                  width: `${MILESTONE_ROW_WIDTH}px`,
                                  height: `${TASK_HEIGHT}px`,
                                }}
                              >
                                {task.milestones.map((milestone_key) => {
                                  // console.log("milestone here", milestone_key)
                                  const milestone = milestones[milestone_key];
                                  return (
                                    <div
                                      onMouseDown={(event) => {
                                        handleMilestoneDrag(
                                          event,
                                          milestone_key,
                                        );
                                      }}
                                      className="absolute select-none p-2"
                                      style={{
                                        display: task.collapsed ? "none" : "flex",
                                        top: `0`,
                                        left: `${milestone.position.x}px`,

                                        height: `${milestone.position.height}px`,
                                        width: `${milestone.position.width}px`,
                                        zIndex: 200,
                                      }}
                                      key={`${milestone}_${milestone.order_number}`}
                                    >
                                        <div className="bg-white rounded h-full w-full 
                                        flex justify-center items-center font-bold border border-gray-400
                                        
                                        ">
                                            {milestone.order_number}
                                        </div>
                                      
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );})}
          </div>
          
        </div>
      </>
    );
}





