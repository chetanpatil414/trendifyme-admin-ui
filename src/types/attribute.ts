export interface AttributeOptionApi {
  id: number;
  value: string;
  displayValue: string;
  sortOrder: number;
  active: boolean;
}

export interface AttributeApi {
  id: number;
  name: string;
  displayName: string;
  type: string;
  active: boolean;
  options: AttributeOptionApi[];
}
