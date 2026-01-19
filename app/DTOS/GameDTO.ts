export interface GameDto {
  metacritic: number | undefined;
  id?: string;
  gameId: number;
  name?: string;
  released?: Date;
  requiredAge?: number;
  dlCcount?: number;
  aboutTheGame?: string;
  supportedLanguages?: string[];
  imageUrl?: string;
  windows?: boolean;
  mac?: boolean;
  linux?: boolean;
  webSite?: string;
  achivements?: number;
  notes?: string;
  developers?: string;
  categories?: string;
  genres?: string;
  publishers?: string;
  metacriticScore?: number;
  userScore?: number;
  screenshotsUrl?: string;
  movies?: string;
  tags?: string;
}
