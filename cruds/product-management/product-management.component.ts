import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/demo/api/product';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { ProductService } from 'src/app/demo/service/product.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductManagement } from 'src/app/interfaces/product-management';
import { ProductManagementService } from 'src/app/services/product-management.service';
import { map } from 'rxjs';

@Component({
    templateUrl: './product-management.component.html',
    providers: [MessageService]
})
export class ProductManagementComponent implements OnInit {
    public cols: any[] = [];
    public rowsPerPageOptions = [5, 10, 20];
    public form!: FormGroup;
    public items: ProductManagement[] = [];
    public item!: ProductManagement;
    public itemDialog: boolean = false;
    public deleteItemDialog: boolean = false;

    constructor(
        private productService: ProductService,
        private messageService: MessageService,
        private productManagementService: ProductManagementService,
        private formBuilder: FormBuilder
    ) { }

    ngOnInit() {
        this.onCreateForm();
        this.onLoadItems();
        this.onLoadCols();
    }

    onLoadCols() {
        this.cols = [
            { field: 'name', header: 'Nome' },
            { field: 'descricao', header: 'Dercricao' },
            { field: 'categoria', header: 'Categoria' },
            { field: 'preco', header: 'Preco' },
            { field: 'quantidade', header: 'Quantidade' }
        ];
    }

    openNew() {
        this.itemDialog = true;
        this.form.reset();

    }

    hideDialog() {
        this.itemDialog = false;
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    onCreateForm() {
       this.form = this.formBuilder.group({
          name: ['', Validators.required],
          categoria: ['', Validators.required],
          descricao: ['', Validators.required],
          preco: ['', Validators.required],
          quantidade: ['', Validators.required],
       });
    }

    onLoadItems() {
        this.productManagementService.getAll().snapshotChanges().pipe(
            map(changes =>
               changes.map(c =>
                ({ id: c.payload.doc.id, ...c.payload.doc.data()})
               )
            )
        ).subscribe(data => {
            this.items = data;
        });
    }

    onSaveForm() {
        if (!this.item?.id) {
            return this.createProductM();
        }

        return this.updateProductM(this.item.id);
    }

    createProductM() {
        this.productManagementService.create(this.form.value).then(() => {
            this.itemDialog = false;
            this.form.reset();

            this.messageService.add({ severity: 'success',
            summary: 'Sucesso', detail: 'Novo Produto Criado', life: 3000});

        })
    }

    updateProductM(id: string) {
        this.productManagementService.update(id, this.form.value).then(res => {
            this.itemDialog = false;

            this.messageService.add({ severity: 'success',
            summary: 'Sucesso', detail: 'Produto Atualizado!', life: 3000});

            this.form.reset();
        })
    }

    deleteProductM(productM: ProductManagement) {
        this.deleteItemDialog = true;
        this.item = productM;
    }

    confirmDeleteProductM() {
        if (!this.item.id) {
            return;
        }
        this.productManagementService.delete(this.item.id).then(res => {
            this.messageService.add({ severity: 'success',
            summary: 'Sucesso', detail: 'Produto Deletado!', life: 3000});

            this.deleteItemDialog = false;
        });
    }

    editProductM(item: ProductManagement) {
        const id = item.id;
        this.item = item;
        delete item.id;
        this.form.setValue(item);

        this.itemDialog = true;
        this.item.id = id;
    }
}
