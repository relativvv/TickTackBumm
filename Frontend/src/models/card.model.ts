export interface PlayingCard {
  state?: number;
  category: PlayingCardCategory;
  value: string;
}

export interface PlayingCardCategory {
  id: number;
  name: string;
}
