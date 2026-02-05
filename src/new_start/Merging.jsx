import { useEffect, useState, useRef } from "react"
import Button from "@mui/material/Button";
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import GradeIcon from '@mui/icons-material/Grade';
import { width } from "@mui/system";
import clickSound from "../assets/click.wav";
const audio = new Audio(clickSound);
audio.volume = 0.3;


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
  // LOGISTIK MILESTONES
  "Aufbau-Plan Konzept": {
    task: "Aufbau-Plan",
    order_number: 2,
    incoming_edges: ["VA-Konzept Finish"],
    outgoing_edges: ["Aufbau-Plan Finish", "Event-Setup Konzept"],
  },
  "Aufbau-Plan Finish": {
    task: "Aufbau-Plan",
    order_number: 8,
    incoming_edges: ["Aufbau-Plan Konzept"],
    outgoing_edges: ["Abbau-Plan Konzept"],
  },

  "Abbau-Plan Konzept": {
    task: "Abbau-Plan",
    order_number: 10,
    incoming_edges: ["Aufbau-Plan Finish"],
    outgoing_edges: ["Abbau-Plan Finish"],
  },
  "Abbau-Plan Finish": {
    task: "Abbau-Plan",
    order_number: 18,
    incoming_edges: ["Abbau-Plan Konzept"],
    outgoing_edges: [],
  },

  "Event-Setup Konzept": {
    task: "Event-Setup",
    order_number: 5,
    incoming_edges: ["Aufbau-Plan Konzept"],
    outgoing_edges: ["Event-Setup Finish"],
  },
  "Event-Setup Finish": {
    task: "Event-Setup",
    order_number: 14,
    incoming_edges: ["Event-Setup Konzept", "Bar-Setup Finish"],
    outgoing_edges: [],
  },

  // GASTRONOMIE MILESTONES
  "Bar-Plan Konzept": {
    task: "Bar-Plan",
    order_number: 1,
    incoming_edges: [],
    outgoing_edges: ["Bar-Plan Finish", "Getränkebestellung Konzept"],
  },
  "Bar-Plan Finish": {
    task: "Bar-Plan",
    order_number: 6,
    incoming_edges: ["Bar-Plan Konzept"],
    outgoing_edges: ["Bar-Setup Konzept"],
  },

  "Getränkebestellung Konzept": {
    task: "Getränkebestellung",
    order_number: 3,
    incoming_edges: ["Bar-Plan Konzept"],
    outgoing_edges: ["Getränkebestellung Finish"],
  },
  "Getränkebestellung Finish": {
    task: "Getränkebestellung",
    order_number: 9,
    incoming_edges: ["Getränkebestellung Konzept"],
    outgoing_edges: ["Bar-Setup Konzept"],
  },

  "Bar-Setup Konzept": {
    task: "Bar-Setup",
    order_number: 11,
    incoming_edges: ["Bar-Plan Finish", "Getränkebestellung Finish"],
    outgoing_edges: ["Bar-Setup Finish"],
  },
  "Bar-Setup Finish": {
    task: "Bar-Setup",
    order_number: 16,
    incoming_edges: ["Bar-Setup Konzept"],
    outgoing_edges: ["Event-Setup Finish"],
  },

  // UNTERHALTUNG MILESTONES
  "Rahmenprogramm planen Konzept": {
    task: "Rahmenprogramm planen",
    order_number: 4,
    incoming_edges: ["Ideen finden Finish"],
    outgoing_edges: ["Rahmenprogramm planen Finish"],
  },
  "Rahmenprogramm planen Finish": {
    task: "Rahmenprogramm planen",
    order_number: 12,
    incoming_edges: ["Rahmenprogramm planen Konzept"],
    outgoing_edges: ["Special Acts koordinieren Konzept"],
  },

  "Special Acts koordinieren Konzept": {
    task: "Special Acts koordinieren",
    order_number: 13,
    incoming_edges: ["Rahmenprogramm planen Finish"],
    outgoing_edges: ["Special Acts koordinieren Finish"],
  },
  "Special Acts koordinieren Finish": {
    task: "Special Acts koordinieren",
    order_number: 20,
    incoming_edges: ["Special Acts koordinieren Konzept"],
    outgoing_edges: [],
  },

  "Ideen finden Konzept": {
    task: "Ideen finden",
    order_number: 0,
    incoming_edges: [],
    outgoing_edges: ["Ideen finden Finish"],
  },
  "Ideen finden Finish": {
    task: "Ideen finden",
    order_number: 3,
    incoming_edges: ["Ideen finden Konzept"],
    outgoing_edges: ["Rahmenprogramm planen Konzept", "Bier Pong Turnier Konzept"],
  },

  "Bier Pong Turnier Konzept": {
    task: "Bier Pong Turnier",
    order_number: 7,
    incoming_edges: ["Ideen finden Finish"],
    outgoing_edges: ["Bier Pong Turnier Finish"],
  },
  "Bier Pong Turnier Finish": {
    task: "Bier Pong Turnier",
    order_number: 15,
    incoming_edges: ["Bier Pong Turnier Konzept"],
    outgoing_edges: [],
  },

  // MUSIK MILESTONES
  "Bühnen-Konzept Konzept": {
    task: "Bühnen-Konzept",
    order_number: 2,
    incoming_edges: [],
    outgoing_edges: ["Bühnen-Konzept Finish"],
  },
  "Bühnen-Konzept Finish": {
    task: "Bühnen-Konzept",
    order_number: 7,
    incoming_edges: ["Bühnen-Konzept Konzept"],
    outgoing_edges: ["Timetable Konzept"],
  },

  "Musik-Konzept Konzept": {
    task: "Musik-Konzept",
    order_number: 1,
    incoming_edges: [],
    outgoing_edges: ["Musik-Konzept Finish"],
  },
  "Musik-Konzept Finish": {
    task: "Musik-Konzept",
    order_number: 5,
    incoming_edges: ["Musik-Konzept Konzept"],
    outgoing_edges: ["Musiker suchen Konzept"],
  },

  "Musiker suchen Konzept": {
    task: "Musiker suchen",
    order_number: 6,
    incoming_edges: ["Musik-Konzept Finish"],
    outgoing_edges: ["Musiker suchen Finish"],
  },
  "Musiker suchen Finish": {
    task: "Musiker suchen",
    order_number: 11,
    incoming_edges: ["Musiker suchen Konzept"],
    outgoing_edges: ["Musiker anschreiben Konzept"],
  },

  "Musiker anschreiben Konzept": {
    task: "Musiker anschreiben",
    order_number: 12,
    incoming_edges: ["Musiker suchen Finish"],
    outgoing_edges: ["Musiker anschreiben Finish"],
  },
  "Musiker anschreiben Finish": {
    task: "Musiker anschreiben",
    order_number: 17,
    incoming_edges: ["Musiker anschreiben Konzept"],
    outgoing_edges: ["Timetable Konzept"],
  },

  "Timetable Konzept": {
    task: "Timetable",
    order_number: 18,
    incoming_edges: ["Bühnen-Konzept Finish", "Musiker anschreiben Finish"],
    outgoing_edges: ["Timetable Finish"],
  },
  "Timetable Finish": {
    task: "Timetable",
    order_number: 24,
    incoming_edges: ["Timetable Konzept"],
    outgoing_edges: [],
  },

  // VORSTAND MILESTONES
  "VA-Konzept Konzept": {
    task: "VA-Konzept",
    order_number: 0,
    incoming_edges: [],
    outgoing_edges: ["VA-Konzept Finish", "Budget-Übersicht Konzept"],
  },
  "VA-Konzept Finish": {
    task: "VA-Konzept",
    order_number: 4,
    incoming_edges: ["VA-Konzept Konzept"],
    outgoing_edges: ["Aufbau-Plan Konzept", "Verischerung Konzept"],
  },

  "Budget-Übersicht Konzept": {
    task: "Budget-Übersicht",
    order_number: 2,
    incoming_edges: ["VA-Konzept Konzept"],
    outgoing_edges: ["Budget-Übersicht Finish"],
  },
  "Budget-Übersicht Finish": {
    task: "Budget-Übersicht",
    order_number: 8,
    incoming_edges: ["Budget-Übersicht Konzept"],
    outgoing_edges: [],
  },

  "Verischerung Konzept": {
    task: "Verischerung",
    order_number: 5,
    incoming_edges: ["VA-Konzept Finish"],
    outgoing_edges: ["Verischerung Finish"],
  },
  "Verischerung Finish": {
    task: "Verischerung",
    order_number: 10,
    incoming_edges: ["Verischerung Konzept"],
    outgoing_edges: ["Securities Konzept"],
  },

  "Securities Konzept": {
    task: "Securities",
    order_number: 12,
    incoming_edges: ["Verischerung Finish"],
    outgoing_edges: ["Securities Finish"],
  },
  "Securities Finish": {
    task: "Securities",
    order_number: 19,
    incoming_edges: ["Securities Konzept"],
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









// Constants for connection handles
const HANDLE_SIZE = 12
const CONNECTION_RADIUS = 20

export default function Merging(){
    const [teamOrder, setTeamOrder] = useState(INITAL_TEAM_ORDER)
    const [teams, setTeams] = useState(positioned_teams)
    const [tasks, setTasks] = useState(positioned_Tasks)
    const [milestones, setMilestones] = useState(adapted_Milestones)
    const [days, setDays] = useState({})
    const [rebuildLayout, setRebuildLayout] = useState(0)
    const [totalHeight, setTotalHeight] = useState(100)
    
    // Connection state
    const [isDraggingConnection, setIsDraggingConnection] = useState(false)
    const [connectionStart, setConnectionStart] = useState(null) // {milestone_key, handleType: 'source'|'target', x, y}
    const [connectionEnd, setConnectionEnd] = useState({x: 0, y: 0})
    const [selectedEdge, setSelectedEdge] = useState(null) // {source: milestone_key, target: milestone_key}
    const containerRef = useRef(null)





    const getDisplayedTeamTasks = (team_key) => {
        // console.log("CALLED CORRECTLY HERE", team_key)
        const raw_tasks = teams[team_key].tasks
        // console.log("the tasks", raw_tasks)
        const activeTasks = raw_tasks.filter(task => !tasks[task].collapsed)
        // console.log("Active Tasks", activeTasks)
        return activeTasks
    }

    // Get absolute position of a milestone's handle in the container
    const getMilestoneHandlePosition = (milestone_key, handleType) => {
        const milestone = milestones[milestone_key]
        if (!milestone) return null
        
        const task = tasks[milestone.task]
        if (!task || task.collapsed) return null
        
        const team = teams[task.team]
        if (!team) return null
        
        // Calculate absolute position
        const baseX = TEAM_WIDTH + TASK_WIDTH + milestone.position.x
        const baseY = team.position.y + task.position.y
        
        // Handle positions (source on right, target on left)
        const handleX = handleType === 'source' 
            ? baseX + milestone.position.width - 4  // right side
            : baseX + 4  // left side
        const handleY = baseY + milestone.position.height / 2
        
        return { x: handleX, y: handleY }
    }

    // Handle connection drag start
    const handleConnectionDragStart = (event, milestone_key, handleType) => {
        event.stopPropagation()
        event.preventDefault()
        
        const handlePos = getMilestoneHandlePosition(milestone_key, handleType)
        if (!handlePos) return
        
        setIsDraggingConnection(true)
        setConnectionStart({ milestone_key, handleType, ...handlePos })
        setConnectionEnd(handlePos)
        
        const handleMouseMove = (e) => {
            if (!containerRef.current) return
            const rect = containerRef.current.getBoundingClientRect()
            setConnectionEnd({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            })
        }
        
        const handleMouseUp = (e) => {
            if (!containerRef.current) return
            const rect = containerRef.current.getBoundingClientRect()
            const mouseX = e.clientX - rect.left
            const mouseY = e.clientY - rect.top
            
            // Check if we're near any other milestone's handle
            for (let key in milestones) {
                if (key === milestone_key) continue
                
                const milestone = milestones[key]
                const task = tasks[milestone.task]
                if (task.collapsed) continue
                
                // Check both source and target handles
                for (let targetHandleType of ['source', 'target']) {
                    const handlePos = getMilestoneHandlePosition(key, targetHandleType)
                    if (!handlePos) continue
                    
                    const distance = Math.sqrt(
                        Math.pow(mouseX - handlePos.x, 2) + 
                        Math.pow(mouseY - handlePos.y, 2)
                    )
                    
                    if (distance < CONNECTION_RADIUS) {
                        // Create connection
                        createConnection(milestone_key, handleType, key, targetHandleType)
                        break
                    }
                }
            }
            
            setIsDraggingConnection(false)
            setConnectionStart(null)
            document.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('mouseup', handleMouseUp)
        }
        
        document.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('mouseup', handleMouseUp)
    }

    // Create a connection between two milestones
    const createConnection = (fromKey, fromHandle, toKey, toHandle) => {
        audio.play();
        // Determine source and target based on handle types
        let sourceKey, targetKey
        if (fromHandle === 'source') {
            sourceKey = fromKey
            targetKey = toKey
        } else {
            sourceKey = toKey
            targetKey = fromKey
        }
        
        // Check if connection already exists
        if (milestones[sourceKey].outgoing_edges.includes(targetKey)) return
        
        setMilestones((prev) => ({
            ...prev,
            [sourceKey]: {
                ...prev[sourceKey],
                outgoing_edges: [...prev[sourceKey].outgoing_edges, targetKey]
            },
            [targetKey]: {
                ...prev[targetKey],
                incoming_edges: [...prev[targetKey].incoming_edges, sourceKey]
            }
        }))
    }

    // Generate SVG path for a connection (bezier curve)
    const getConnectionPath = (startX, startY, endX, endY) => {
        const controlPointOffset = Math.abs(endX - startX) * 0.5
        return `M ${startX} ${startY} C ${startX + controlPointOffset} ${startY}, ${endX - controlPointOffset} ${endY}, ${endX} ${endY}`
    }

    // Generate straight line path for dragging
    const getStraightPath = (startX, startY, endX, endY) => {
        return `M ${startX} ${startY} L ${endX} ${endY}`
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
            audio.play();
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
          <div className="h-full w-full bg-white rounded relative" ref={containerRef}>

            {/* SVG Layer for Connections */}
            <svg 
              className="absolute top-0 left-0 w-full h-full pointer-events-none"
              style={{ zIndex: 100 }}
            >
              <defs>
                <style>
                  {`
                    @keyframes flowAnimation {
                      from { stroke-dashoffset: 18; }
                      to { stroke-dashoffset: 0; }
                    }
                  `}
                </style>
              </defs>
              
              {/* Render existing connections */}
              {Object.entries(milestones).map(([milestone_key, milestone]) => {
                return milestone.outgoing_edges.map((targetKey) => {
                  const sourcePos = getMilestoneHandlePosition(milestone_key, 'source')
                  const targetPos = getMilestoneHandlePosition(targetKey, 'target')
                  
                  if (!sourcePos || !targetPos) return null
                  
                  const isSelected = selectedEdge && 
                    selectedEdge.source === milestone_key && 
                    selectedEdge.target === targetKey
                  
                  return (
                    <g key={`${milestone_key}-${targetKey}`}>
                      {/* Invisible wider path for easier clicking */}
                      <path
                        d={getConnectionPath(sourcePos.x, sourcePos.y, targetPos.x, targetPos.y)}
                        stroke="transparent"
                        strokeWidth="15"
                        fill="none"
                        style={{ cursor: 'pointer', pointerEvents: 'auto' }}
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedEdge({ source: milestone_key, target: targetKey })
                        }}
                      />
                      {/* Visible path */}
                      <path
                        d={getConnectionPath(sourcePos.x, sourcePos.y, targetPos.x, targetPos.y)}
                        stroke={isSelected ? "#ef4444" : "#010101"}
                        strokeWidth={isSelected ? "4" : "3"}
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray="12, 6"
                        style={{
                          animation: 'flowAnimation 1.5s linear infinite',
                          pointerEvents: 'none'
                        }}
                      />
                    </g>
                  )
                })
              })}
              
              {/* Render dragging connection - straight line */}
              {isDraggingConnection && connectionStart && (
                <path
                  d={getStraightPath(
                    connectionStart.x, 
                    connectionStart.y, 
                    connectionEnd.x, 
                    connectionEnd.y
                  )}
                  stroke="#6366f1"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  fill="none"
                  strokeLinecap="round"
                  opacity="0.7"
                  style={{ pointerEvents: 'none' }}
                />
              )}
            </svg>

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
                                        relative group
                                        ">
                                            {milestone.order_number}
                                            
                                            {/* Target Handle (Left) */}
                                            <div
                                              className="absolute w-3 h-3 bg-blue-500 rounded-full 
                                                         opacity-0 group-hover:opacity-100 
                                                         hover:scale-125 transition-all cursor-crosshair
                                                         border-2 border-white shadow"
                                              style={{
                                                left: '-6px',
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                zIndex: 300,
                                              }}
                                              onMouseDown={(e) => handleConnectionDragStart(e, milestone_key, 'target')}
                                            />
                                            
                                            {/* Source Handle (Right) */}
                                            <div
                                              className="absolute w-3 h-3 bg-green-500 rounded-full 
                                                         opacity-0 group-hover:opacity-100 
                                                         hover:scale-125 transition-all cursor-crosshair
                                                         border-2 border-white shadow"
                                              style={{
                                                right: '-6px',
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                zIndex: 300,
                                              }}
                                              onMouseDown={(e) => handleConnectionDragStart(e, milestone_key, 'source')}
                                            />
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





