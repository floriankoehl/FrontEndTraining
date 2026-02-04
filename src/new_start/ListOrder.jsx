import { useEffect, useState } from "react";
import Button from '@mui/material/Button';

const INITIAL_TASKS = [
  "Konzept",
  "Bar-Plan",
  "Event-Setup",
  "Musik",
  "Finanzen",
];

const TASKWIDTH = 300
const TASKHEIGHT = 50

const updated_tasks = INITIAL_TASKS.map((task, index)=>{
    return ({
        name: task, 
        position: {
            x: 0,
            y: TASKHEIGHT * index, 
            height: TASKHEIGHT,
            width: TASKWIDTH
        }
    })
})

const inital_taskOrder = updated_tasks.map((task)=>{
    return (
        task.name
    )
})











export default function ListOrder(){
    const [tasks, setTasks] = useState(updated_tasks)
    const [taskOrder, setTaskOrder] = useState(inital_taskOrder)
    const [fromIndex, setFromIndex] = useState(null)
    const [toIndex, setToIndex] = useState(null)

    // Rerenderes the list when taskOrder changed
    useEffect(()=>{
        const new_tasks = taskOrder.map((task, index)=>{
            return ({
                name: task, 
                position: {
                    x: 0,
                    y: TASKHEIGHT * index, 
                    height: TASKHEIGHT,
                    width: TASKWIDTH
                }
            })
        })
        console.log("NEW TASKS", new_tasks)
        setTasks(new_tasks)
    },[taskOrder])


    // Simply swaps positions of elements
    const change_order = (from_index, to_index) => {

        const copy_order_tasks = [...taskOrder]

        // removing element
        const [second_element] = copy_order_tasks.splice(from_index,1)

        // adding at correct position again
        copy_order_tasks.splice(to_index, 0, second_element)

        setTaskOrder(copy_order_tasks)

    }

    // Complete Drag and Drop functionality
    const onMouseDown = (event, current_index) => {
        const draggedTask = tasks[current_index]
        const startX = event.clientX - draggedTask.position.x
        const startY = event.clientY - draggedTask.position.y
        let y_set_to = draggedTask.position.y
        let to_index = current_index

        // Tell Browser which index is dragged for Z-index
        setFromIndex(current_index)

        











        const onMouseMove = (event) => {
            const new_x = event.clientX - startX
            const new_y = event.clientY - startY

            
            // Evaluate index for snapping
            for (let i in tasks) {
                const compare_task = tasks[i]
                // Snaps to index if the current y is +- 20 of the current index y position
                if (new_y > compare_task.position.y - 20 &&
                    new_y < compare_task.position.y + 20
                ) {
                    console.log("UPADETED", i)
                    to_index = i
                }
            }
            setToIndex(to_index)




            setTasks((prevTasks)=>{
                return prevTasks.map((task, compare_index)=>{
                    if (compare_index !== current_index) {
                        return task
                    }

                    return {
                        ...task, 
                        position: {
                            ...task.position,
                            x: new_x,
                            y: new_y
                        }
                    }
                })
            })
        }
        
        


        const onMouseUp = () => {

            // Snap to correct position
            change_order(current_index, to_index)
            setToIndex(null)
            setFromIndex(null)

            // Clean up the Event Listeners
            document.removeEventListener("mousemove", onMouseMove)
            document.removeEventListener("mouseup", onMouseUp)
        }



































        document.addEventListener("mousemove", onMouseMove)
        document.addEventListener("mouseup", onMouseUp)
    }



    return (
        <>
            <div className="h-screen w-screen bg-gray-400 p-20">
                {/* <Button 
                onClick={()=>{change_order(1, 0)}}
                variant="contained">Change Order</Button> */}
                <div className="h-full w-full bg-white relative">
                    {tasks.map((task, index)=>{
                        return (

                            <div
                            className="bg-blue-200 absolute border flex items-center  select-none flex justify-between"
                            
                            onMouseDown={(e)=>{onMouseDown(e, index)}}
                            key={index}
                            style={{
                                top: task.position.y,
                                left: task.position.x,
                                width: task.position.width,
                                height: task.position.height,
                                zIndex: fromIndex == index ? 10 : 5,
                                boxShadow:
                                            fromIndex === index
                                            ? "0 8px 20px rgba(0, 0, 0, 0.62)"
                                            : "none",
                            }}
                            >   
                            {toIndex == index && <div className="absolute top-0 w-full bg-black h-2"></div>} 

                            
                                {task.name}
                                <Button 
                                onClick={()=>{change_order(index, 0)}}
                                variant="contained">Change Order</Button>
                            </div>
                        )
                    })}
                </div>
            </div>
        </>
    )
}