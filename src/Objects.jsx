import { useEffect, useState } from "react"
import Button from '@mui/material/Button';
import clickSound from "./assets/click.wav"

const audio = new Audio(clickSound)




export default function Objects(){
    const [matrix, setMatrix] = useState({})
    const [colorMap, setColorMap] = useState({})
    const [boxColor, setBoxColor] = useState("white")
    const [onDownColor, setOnDownColor] = useState("gray")

    const [parentMapping, setParentMapping] = useState({})
    const [groupPixels, setGroupPixels] = useState({})
    const [numTeams, setNumTeams] = useState(8)
    const [numDays, setNumDays] = useState(15)

    const [lockTeams, setLockTeams] = useState(true)

    const [universalHeight, setUniversalHeight] = useState(70)
    const [universalWidth, setUniversalWidth] = useState(70)

    const [dayList, setDayList] = useState({})



    // Initalization of many things
    useEffect(()=>{
        setLockTeams(true)
        //________ initalize elements
        // Draggables
        const teamCount = numTeams
        const dynamic_matrix = {}
        for (let i = 0; i < teamCount; i ++) {
            
            dynamic_matrix[i] = {x: universalWidth , y: universalHeight * i , width: universalWidth, height: universalHeight}
        }
        setMatrix(dynamic_matrix)
        
        // Colors of draggables
        const dynamic_colorMap = {}
        for (let i = 0; i < 7; i ++) {
            dynamic_colorMap[i] = boxColor;
        }
        setColorMap(dynamic_colorMap)

        const dynamic_parentMapping = {}
        for (let i = 0; i < teamCount; i++) {
        dynamic_parentMapping[i] = i
        }
        setParentMapping(dynamic_parentMapping)


  
    },[])





    // Update number of teams
    useEffect(()=>{
        // Team Pixels
        const dynamic_groupPixels = {}
        const dayCount = numDays
        for (let i = 0; i < numTeams; i ++) {
            dynamic_groupPixels[i] = {
                x: 0, 
                y: universalHeight * i,
                width: dayCount * universalWidth ,
                height: universalHeight
            }
        }
        setGroupPixels(dynamic_groupPixels)


        const teamCount = numTeams
        const dynamic_dayList = {}
        for (let i = 0; i < numDays; i ++){
            if (i == 0) {
                dynamic_dayList[i] = {
                x: 0,
                y: 0,
                width: universalWidth,
                height: teamCount * universalHeight
            }
            } else {
                dynamic_dayList[i] = {
                x: universalWidth * i,
                y: 0,
                width: universalWidth,
                height: teamCount * universalHeight
            }
            }


            
        }
        setDayList(dynamic_dayList)

    

    }, [numTeams])



    // Main Drag Functionality
    const handleMouseDown = (key, e) => {
        setColorMap((prev) => ({
        ...prev,
        [key]: onDownColor
        })) 
        

        const startX = e.clientX - matrix[key].x;
        const startY = e.clientY - matrix[key].y;


        const handleMouseMove = (e) => {
            let new_x = e.clientX - startX;
            let new_y = e.clientY - startY;


            if (lockTeams) {
                if (key in parentMapping) {
                    new_y = groupPixels[parentMapping[key]].y
                } else {
                    console.log("currently not mapped")
                }
                
                
            }


            setMatrix((prev)=>{
                return ({
                    ...prev,
                    [key]: {
                        ...prev[key],
                        x: new_x, 
                        y: new_y
                        }}
                )})
            }


    

            const handleMouseUp = () => {
                setColorMap((prev)=>{
                    return ({
                        ...prev, 
                    [key]: boxColor
                    })
                })

                setMatrix((old_matrix)=>{
                    let new_y = old_matrix[key].y
                    let new_x = old_matrix[key].x

                    // Snapping to groups
                    for (let element in groupPixels) {
                        const elementNum = parseInt(element) 
                        const upper_boundary = groupPixels[element].y 
                        const lower_boundary = groupPixels[element].y + groupPixels[element].height/2
                        if (old_matrix[key].y > groupPixels[element].y){
                            if (old_matrix[key].y <= lower_boundary) {
                                new_y = groupPixels[element].y
                                setParentMapping((prev)=>(
                                            {
                                                ...prev, 
                                                [key]: element
                                            }
                                        ))
                            } else {

                                    const nextKey = elementNum + 1  // ← Now this works: 1 + 1 = 2
                                    if (nextKey in groupPixels) {
                                        new_y = groupPixels[nextKey].y  // ← Use nextKey
                                        setParentMapping((prev)=>(
                                            {
                                                ...prev, 
                                                [key]: nextKey
                                            }
                                        ))
                                    }
                                
                            }

                        }

                    }


                    // Snapping to days
                    const attempt = old_matrix[key]
                    for (let day in dayList){
                        const day_int = parseInt(day)
                        // console.log(day, dayList[day])
                        if (attempt.x > dayList[day].x && attempt.x < dayList[day].x + dayList[day].width){
                            // console.log("INDISE", day)
                            if (attempt.x <= dayList[day].x + dayList[day].width/2) {
                                // console.log("SHOULD BE SNAPPED TO", day)
                                new_x = dayList[day].x

                            }
                            if (attempt.x > dayList[day].x + dayList[day].width/2) {
                                if ((day_int + 1) in dayList) {
                                    new_x = dayList[(day_int + 1)].x
                                    // console.log("SHOULD BE SNAPPED TO", day_int+1)
                                }
                                
                            }
                        }
                        
                        
                    }



                    audio.volume = 0.2
                    audio.play()
                    return ({
                        ...old_matrix,
                        [key]:{
                            ...old_matrix[key],
                            y: new_y,
                            x: new_x
                        }
                            
                    } 
                    )
                })
            



            document.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('mouseup', handleMouseUp)
            }

            document.addEventListener('mousemove', handleMouseMove)
            document.addEventListener('mouseup', handleMouseUp)
        }




    return (
        <>
            <div className="w-screen h-screen flex justify-center flex-col items-center relative p-10">

                {/* Settings Buttons */}
                <div className="flex mb-2 justify-evenly w-full" >
                    <div className="flex gap-5">
                        <Button onClick={()=>{setNumTeams(numTeams+1)}} variant="contained">Add Team</Button>
                        <Button onClick={()=>{setNumTeams(numTeams-1)}} variant="contained" color="error">Remove Team</Button>
                    </div>
                    <div className="">
                        <Button 
                        onClick={()=>{setLockTeams(!lockTeams)}}
                        style={{
                            backgroundColor: lockTeams ? "purple" : "white",
                            color: lockTeams ? "white" : "black"
                        }}
                        className="border!"
                        color="secondary">
                            {lockTeams ? "unlock" : "lock"}
                        </Button>
                    </div>
                    

                </div>
                






                {/*  DRAGGING CONTAINER */}
                <div className="h-full w-full rounded-xl relative caret-transparent bg-gray-200">
                    

                    {/* GROUPS */}
                    {Object.entries(groupPixels).map(([key, value])=>{
                        return (
                            <div 
                        className="absolute bg-blue-200 border-b "
                        key={key}
                        style={{
                            top: `${groupPixels[key].y}px`,
                            left: `${groupPixels[key].x}px`,
                            width: `${groupPixels[key].width}px`,
                            height: `${groupPixels[key].height}px`
                        }}
                        >
                            {key}
                        </div>
                        )
                        
                    })}



                    {/* DAYLIST */}
                    {Object.entries(dayList).map(([key, value])=>(
                        <div
                        className="border-r absolute"
                        key={key}
                        style={{
                            top: `${dayList[key].y}px`,
                            left: `${dayList[key].x}px`,
                            width: `${dayList[key].width}px`,
                            height: `${dayList[key].height}px`
                        }}
                        >

                        </div>
                    ))}

                    {/* <div className="absolute w-full h-full">

                    </div> */}


                    {/* ATTEMPS */}
                    {Object.entries(matrix).map(([key, value])=>(
                        <div 
                        onMouseDown={(e)=>{handleMouseDown(key, e)}}
                        className="absolute rounded-xl p-2
                        caret-transparent cursor-pointer select-none 
                        "
                        style={{
                            

                            top: `${matrix[key].y}px`,
                            left: `${matrix[key].x}px`,
                            width: `${matrix[key].width}px`,
                            height: `${matrix[key].height}px`
                        }}
                        key={key}>
                            <div 
                            style={{
                                backgroundColor: `${colorMap[key]}`
                            }}
                            // backgroundColor: `${colorMap[key]}`
                            className="bg-white h-full w-full rounded-xl flex justify-center items-center
                            border border-gray-300 shadow
                            ">
                                {key}
                            </div>
                            
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}