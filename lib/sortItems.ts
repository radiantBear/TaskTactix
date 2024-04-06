import ListItem from "@/lib/model/listItem";

export default function sortItems(a: ListItem, b: ListItem): number {
  if(a.dateCompleted && b.dateCompleted) {
    if(a.dateCompleted < b.dateCompleted)
      return 1;
    else if(b.dateCompleted < a.dateCompleted)
      return -1;
    else
      return 0;
  }

  if(a.status == 'Completed' && b.status != 'Completed')
    return 1;
  if(b.status == 'Completed' && a.status != 'Completed')
    return -1;

  if(a.dateDue > b.dateDue)
    return 1;
  if(b.dateDue > a.dateDue)
    return -1;

  if(
    (a.priority == 'Low' && (b.priority == 'Medium' || b.priority == 'High'))
    || (a.priority == 'Medium' && b.priority == 'High') 
  )
    return 1;
  if(
    (b.priority == 'Low' && (a.priority == 'Medium' || a.priority == 'High'))
    || (b.priority == 'Medium' && a.priority == 'High') 
  )
    return -1;

  return 0;
}