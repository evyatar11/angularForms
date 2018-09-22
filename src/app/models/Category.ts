import {Question} from './Question';

export class Category {
  categoryId: number;
  categoryWeight: number;
  categoryName: string;
  formId: number;
  questionList: Question [];
}
