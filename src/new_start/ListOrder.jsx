import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import GradeIcon from '@mui/icons-material/Grade';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';

const INITIAL_GROUPS = {
  Logistik: {
    tasks: [
    {name: "Aufbau koordinieren", collapsed: false}, 
    {name: "Abbau planen", collapsed: false}, 
    {name: "Materialtransport", collapsed: false}
    ]
  },
  Gastronomie: 
  {
    tasks: [
    {name: "Getränkebestellung", collapsed: false},
    {name: "Bar-Plan erstellen", collapsed: false},
    {name: "Personal einteilen", collapsed: false},
  ]
  },
  Unterhaltung: 
  {
    tasks: [
    {name: "Rahmenprogramm planen", collapsed: false},
    {name: "Moderation organisieren", collapsed: false},
    {name: "Special Acts koordinieren", collapsed: false},
    {name: "Ideen finden", collapsed: false},
    {name: "mehr und mehr", collapsed: true}
  ],
  },

  };

const GROUPWIDTH = 400;
const GROUPHEIGHT = 50;
const GROUP_COLLAPSE_HEIGHT = 50;
const GROUP_EXPANDED_HEIGHT_DEFAULT = 200;
const TASKHEIGHT = 50

const modified_groups = {};
const groupKeys = Object.keys(INITIAL_GROUPS);
for (let i = 0; i < groupKeys.length; i++) {
  const group_key = groupKeys[i];

    const num_active_groups = INITIAL_GROUPS[group_key].tasks.filter(item => !item.collapsed).length
    console.log("FOr group ,", group_key, num_active_groups)

  modified_groups[group_key] = {
    collapsed: false,
    order_number: i,
    x: 0,
    y: 0,
    height: TASKHEIGHT * num_active_groups,
    width: GROUPWIDTH,
    tasks: INITIAL_GROUPS[group_key].tasks
  };
}
console.log("This is important", modified_groups);

const inital_groupOrder = Object.keys(INITIAL_GROUPS).map((group) => {
  return group;
});

export default function ListOrder() {
  const [groups, setGroups] = useState(modified_groups);
  const [groupOrder, setGroupOrder] = useState(inital_groupOrder);
  const [fromIndex, setFromIndex] = useState(null);
  const [toIndex, setToIndex] = useState(null);
  const [rebuildGroups, setRebuildGroups] = useState(0);

  useEffect(() => {
    const new_groups = {};
    let accumalative_height = 0;



    for (let group_index in groupOrder) {
      const group_key = groupOrder[group_index];
      const group = groups[group_key];
      let group_height = group.height;
        const num_active_groups = group.tasks.filter(item => !item.collapsed).length
        console.log("also while rebuilding", num_active_groups)

        if (!group.collapsed) {
            group_height = TASKHEIGHT * num_active_groups
        }



      new_groups[group_key] = {
        collapsed: group.collapsed,
        order_number: group_index,
        x: 0,
        y: accumalative_height,
        height: group_height,
        width: GROUPWIDTH,
        tasks: group.tasks
      };
      accumalative_height += group_height;
    }

    console.log("NEW GROUPS: ", new_groups)
    setGroups(new_groups);
  }, [groupOrder, rebuildGroups]);

  // Simply swaps positions of elements
  const change_order = (from_index, to_index) => {
    const copy_order_groups = [...groupOrder];

    // removing element
    const [second_element] = copy_order_groups.splice(from_index, 1);

    // adding at correct position again
    copy_order_groups.splice(to_index, 0, second_element);

    setGroupOrder(copy_order_groups);
  };

   const swapIndeces = (list, from_index, to_index) => {
        const swappedList = [...list]

        const [popped_element] = swappedList.splice(from_index, 1)
        swappedList.splice(to_index, 0, popped_element)

        return swappedList
  }

  const putTaskonTop = (group, index) => {
    const group_tasks = groups[group].tasks
    const from_index = group_tasks.indexOf(index)

    const updated_list = swapIndeces(group_tasks, from_index, 0)


    setGroups((prev)=> {
        return ({
            ...prev, 
            [group]: {
                ...prev[group],
                        tasks: updated_list
            }

        })
    })
    setRebuildGroups(rebuildGroups+1)
  }




  // Complete Drag and Drop functionality
  const onMouseDown = (event, key) => {
    const draggedGroup = groups[key];
    const current_index = draggedGroup.order_number;

    const startX = event.clientX - draggedGroup.x;
    const startY = event.clientY - draggedGroup.y;
    let to_index = current_index;

    setFromIndex(current_index);

    const onMouseMove = (event) => {
      const new_x = event.clientX - startX;
      const new_y = event.clientY - startY;

      // Evaluate index for snapping
      for (let comapre_key in groups) {
        const compare_group = groups[comapre_key];

        if (new_y > compare_group.y - 20 && new_y < compare_group.y + 20) {
          to_index = groups[comapre_key].order_number;
        }
      }
      setToIndex(to_index);

      // Update groups while dragging (has nothing to do with snapping)
      setGroups((prevGroups) => {
        return {
          ...prevGroups,
          [key]: {
            ...prevGroups[key],
            x: new_x,
            y: new_y,
          },
        };
      });
    };

    const onMouseUp = () => {
      // Snap to correct position
      change_order(current_index, to_index);
      setToIndex(null);
      setFromIndex(null);

      // Clean up the Event Listeners
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  const change_height = (key) => {
    setGroups((prev) => {
      const nextCollapsed = !prev[key].collapsed;
      console.log("also here the key", prev[key])
      const num_acitve_groups = prev[key].tasks.filter(item => !item.collapsed).length
        console.log("also here the key", num_acitve_groups)

      return {
        ...prev,
        [key]: {
          ...prev[key],
          collapsed: nextCollapsed,
          height: nextCollapsed
            ? GROUP_COLLAPSE_HEIGHT
            : TASKHEIGHT * num_acitve_groups,
        },
      };
    });

    setRebuildGroups((v) => v + 1);
  };


 






  return (
    <>
      <div className="h-screen w-screen bg-gray-400 p-20">
        <div className="h-full w-full bg-white relative">
          {Object.entries(groups).map(([key, value]) => {
            return (
              <div
                className="bg-blue-200 absolute border flex p-1  select-none flex justify-between "
                onMouseDown={(e) => {
                  onMouseDown(e, key);
                }}
                key={key}
                style={{
                  top: value.y,
                  left: value.x,
                  width: value.width,
                  height: value.height,
                  zIndex: fromIndex == groups[key].order_number ? 10 : 5,
                  boxShadow:
                    fromIndex === groups[key].order_number
                      ? "0 8px 20px rgba(0, 0, 0, 0.62)"
                      : "none",
                }}
              >
                {toIndex == groups[key].order_number && (
                  <div className="absolute top-0 w-full bg-black h-2"></div>
                )}


                <h1 className="font-bold text-lg">{key}</h1>
                <div className="flex flex-col">
                {Object.entries(value.tasks).map(([task_key, task_value])=>{
                    return (
                      <div
                        style={{
                          display: (value.collapsed || task_value.collapsed) ? "none" : "block",
                          height: `${TASKHEIGHT}px`,
                          width: "250px",
                        }}
                        className="bg-white border relative"
                        key={`${task_key}_${task_value.name}`}
                      >
                        {task_value.name}
                        <div className="absolute top-0 right-0 flex">
                          <div
                            className="hover:text-blue-700!"
                            onClick={() => {
                              putTaskonTop(key, task_value);
                            }}
                          >
                            <GradeIcon />
                          </div>

                          <div
                            className=" hover:text-blue-500!"
                            onClick={() => {
                              setGroups((prev)=>{
                                
                                return {
                                  ...prev,
                                  [key]: {
                                    ...prev[key],
                                    tasks: prev[key].tasks.map((task, index) =>
                                      index === Number(task_key)
                                        ? {
                                            ...task,
                                            collapsed: !task.collapsed,
                                          }
                                        : task,
                                    ),
                                  },
                                };
                              })
                              setRebuildGroups(rebuildGroups+1)
                            }}
                          >
                            <ZoomOutIcon />
                          </div>
                        </div>
                      </div>
                    );
                })}
                </div>













                
                <div 
                
                style={{
                display: groups[key].collapsed ? "block" : "flex",
                
                }}

                className="absolute bottom-1 left-1 flex flex-col gap-1">
                  <Button
                    className="h-[15px]"
                    onClick={() => {
                      change_order(groups[key].order_number, 0);
                    }}
                    variant="contained"
                    style={{
                        marginRight: groups[key].collapsed ? 3 : 0,
                    }}
                  >
                    On Top
                  </Button>
                  <Button
                    className="h-[15px]"
                    onClick={() => {
                      change_height(key);
                    }}
                    variant="contained"
                    color="success"
                    style={{
                        marginRight: groups[key].collapsed ? 3 : 0,
                    }}
                  >
                    Resize
                  </Button>
                  <Button
                    className="h-[15px]"
                    onClick={() => {
                      setGroups((prev)=>{
                        return ({
                            ...prev, 
                            [key]: {
                                ...prev[key],
                                tasks: prev[key].tasks.map((task)=>{
                                    return (
                                         {...task, collapsed: false}
                                    )
                                   
                                })
                            }
                        })
                      })
                      setRebuildGroups(rebuildGroups+1)
                    }}
                    variant="contained"
                    color="error"
                  >
                    Show All
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
