export interface Block {
  revealed?: boolean
  aroundMine?: number
  isMine?: boolean
  flagged?: boolean
  x: number
  y: number
}
