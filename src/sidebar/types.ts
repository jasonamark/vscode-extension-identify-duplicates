export interface ITree {
  name: string;
  children?: ITree[];
  highlight?: boolean;
  value?: number;
}

export interface IChartData {
  chartData: ITree | undefined;
}
