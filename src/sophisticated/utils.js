





  export const snap_vertically = (new_y, y_compare, height_compare) => {
    if (
      new_y + height_compare / 2 > y_compare &&
      new_y <= y_compare + height_compare / 2
    ) {
      return y_compare;
    }
    return new_y;
  };




 export const snap_horizontally = (new_x, x_compare, width_compare) => {
    if (
      new_x + width_compare/2 > x_compare && 
      new_x <= x_compare + width_compare/2
    ) {
      return x_compare
    }
    return new_x
  }





  // Locks Child in Parent
  export const handleLockedChildPosition = (
    child,
    parent,
    new_x,
    new_y,
    condition = true,
  ) => {
    let checked_x = new_x;
    let checked_y = new_y;

    const left_boundary = parent.x;
    const right_boundary = parent.x + parent.width;
    const top_boundary = parent.y;
    const bottom_boundary = parent.y + parent.height;

    if (condition) {
      if (new_x < left_boundary) {
        checked_x = left_boundary;
      }
      if (new_y < top_boundary) {
        checked_y = top_boundary;
      }
      if (new_x + child.width > right_boundary) {
        checked_x = right_boundary - child.width;
      }
      if (new_y + child.height > bottom_boundary) {
        checked_y = bottom_boundary - child.height;
      }
    }

    return [checked_x, checked_y];
  };






  // startDraggingBox
  export const createBezierPath = (sourceX, sourceY, targetX, targetY) => {
    const dx = Math.abs(targetX - sourceX) * 0.7;
    return `M ${sourceX} ${sourceY} C ${sourceX + dx} ${sourceY} ${targetX - dx} ${targetY} ${targetX} ${targetY}`;
  };



