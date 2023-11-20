import { Injectable } from '@angular/core';
import {
    AngularFirestore,
    AngularFirestoreCollection
} from '@angular/fire/compat/firestore';
import { ProductManagement } from '../interfaces/product-management';

@Injectable({
  providedIn: 'root'
})
export class ProductManagementService {
  private dbPathProductManagement = 'product-management';
  private ProductManagementRef: AngularFirestoreCollection<any>;

  constructor(private db: AngularFirestore) {
      this.ProductManagementRef = db.collection(this.dbPathProductManagement);
    }

    getAll(): AngularFirestoreCollection<any> {
        return this.ProductManagementRef;
    }

    create(productManagement: ProductManagement) {
        return this.ProductManagementRef.add({ ...productManagement });
    }

    update(id: string, data: ProductManagement): Promise<void> {
        return this.ProductManagementRef.doc(id).update(data);
    }

    delete(id: string): Promise<void> {
        return this.ProductManagementRef.doc(id).delete();
    }
}