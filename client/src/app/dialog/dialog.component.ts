import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent implements OnInit {
  taskCategory = ['Todo', 'Grocery list'];

  taskForm!: FormGroup;
  actionBtn: string = 'Add';

  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private dialogRef: MatDialogRef<DialogComponent>
  ) {}

  ngOnInit(): void {
    this.taskForm = this.formBuilder.group({
      taskName: ['', Validators.required],
      category: ['', Validators.required],
      comment: [''],
      date: [''],
    });

    if (this.editData) {
      this.actionBtn = 'Edit';
      this.taskForm.controls['taskName'].setValue(this.editData.taskName);
      this.taskForm.controls['category'].setValue(this.editData.category);
      this.taskForm.controls['date'].setValue(this.editData.date);
      this.taskForm.controls['comment'].setValue(this.editData.comment);
    }
  }

  addTask() {
    if (this.editData) {
      this.updateTask();
    } else if (this.taskForm.valid) {
      this.api.postTask(this.taskForm.value).subscribe({
        next: (res) => {
          this.taskForm.reset();
          this.dialogRef.close('save');
        },
        error: () => {
          alert('Error while adding task');
        },
      });
    }
  }

  updateTask() {
    this.api.putTask(this.taskForm.value, this.editData.id).subscribe({
      next: (res) => {
        this.taskForm.reset();
        this.dialogRef.close('update');
      },
      error: () => {
        alert('Error while updating');
      },
    });
  }
}
