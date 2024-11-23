const HISTORY: {
  toolType: string;
  props: any;
}[] = [];

export function pushHistory(toolType: string, props: any) {
  HISTORY.push({ toolType, props });
}
