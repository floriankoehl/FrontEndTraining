import Button from '@mui/material/Button';
import { useRef, useState } from 'react';

export default function ParentItem({parentRef, setBorder, border}){
    const [snappedItemsMap, setSnappedItemsMap] = useState({1: null, 2: null, 3: null})

    const lockParent = () => {
        setBorder(!border)
    }

    return (
        <>
            {/* Parent Container */}
            <div 
            className="h-100 w-70 bg-blue-200 rounded-xl relative p-3"
            ref={parentRef}>
            <div className='absolute top-0 left-0 w-full bg-white flex items-center p-2 gap-2'>
                <Button 
                style={{
                backgroundColor: `${border ? "red" : "blue"}`
                }}
                onClick={()=>{lockParent()}}
                variant="contained">
                {border ? "Locked" : "Free"}

                </Button>
                <Button 
                variant="contained">
                Snap
                </Button>

                
            </div>
            <div className='h-full w-full bg-gray-200 pt-15 flex flex-col gap-5'>
                <div className='w-full h-10 bg-white rounded-lg'>
                </div>
                <div className='w-full h-10 bg-white rounded-lg'>
                </div>
                <div className='w-full h-10 bg-white rounded-lg'>
                </div>
            </div>
            
            </div>
            
        </>
    )
}