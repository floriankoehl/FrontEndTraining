import { useEffect, useState } from "react";
import Button from "@mui/material/Button";

const INITIAL_GROUPS = {
  Logistik: {
    tasks: ["Aufbau koordinieren", "Abbau planen", "Materialtransport"]
  },
  Gastronomie: 
  {
    tasks: [
    "Getränkebestellung",
    "Bar-Plan erstellen",
    "Personal einteilen",
  ]
  },
  Unterhaltung: 
  {
    tasks: [
    "Rahmenprogramm planen",
    "Moderation organisieren",
    "Special Acts koordinieren",
    "Ideen finden",
    "mehr und mehr"
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

  modified_groups[group_key] = {
    collapsed: false,
    order_number: i,
    x: 0,
    y: 0,
    height: TASKHEIGHT * INITIAL_GROUPS[group_key].tasks.length,
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

    // console.log("_____STARTING______")
    // console.log("_____STARTING______")
    // console.log("_____STARTING______")
    // console.log("_____STARTING______")
    for (let group_index in groupOrder) {
      const group_key = groupOrder[group_index];
      const group = groups[group_key];
      const group_height = group.height;

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

    console.log("Changed", new_groups)
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

      return {
        ...prev,
        [key]: {
          ...prev[key],
          collapsed: nextCollapsed,
          height: nextCollapsed
            ? GROUP_COLLAPSE_HEIGHT
            : TASKHEIGHT * prev[key].tasks.length,
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
                            display: value.collapsed ? "none" : "block",
                            height: `${TASKHEIGHT}px`,
                            width: "200px"
                        }}
                        className="bg-white border"
                        key={task_key}>
                        {task_value}
                        </div>
                    )
                })}
                </div>













                
                <div className="absolute bottom-0 left-0">
                  <Button
                    className="h-[15px]"
                    onClick={() => {
                      change_order(groups[key].order_number, 0);
                    }}
                    variant="contained"
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
                  >
                    Resize
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
