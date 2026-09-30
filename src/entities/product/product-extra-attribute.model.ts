/* export interface ProductExtraAttribute {
  name: string; // coincidirá con 'name' de tu DB (ej: "Es Smart")
  label: string; // usaremos el name para la etiqueta visual
  dataType: 'text' | 'number' | 'boolean'; // los tipos que veo en tu imagen
  value?: string;
  required?: boolean;
}
 */

export interface AttributeValidations {
  required: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  min?: number;
  max?: number;
}

export interface ProductExtraAttribute {
  id: number;
  name: string;
  label: string;
  dataType: 'text' | 'number' | 'boolean' | 'date';
  categoryId: number;
  validations: AttributeValidations;
}
