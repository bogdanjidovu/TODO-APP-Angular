import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';
import { ApiService } from './services/api.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'AngularCRUD';

  displayedColumns: string[] = [
    'taskName',
    'category',
    'date',
    'comment',
    'isDone',
    'action',
  ];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog, private api: ApiService) {}

  ngOnInit(): void {
    this.getAllTasks();
  }

  openDialog() {
    this.dialog
      .open(DialogComponent, {
        width: '30%',
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'save') {
          this.getAllTasks();
        }
      });
  }

  getAllTasks() {
    this.api.getTask().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: () => {
        alert('Error while trying to get tasks');
      },
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  editTask(row: any) {
    this.dialog
      .open(DialogComponent, {
        width: '30%',
        data: row,
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'update') {
          this.getAllTasks();
        }
      });
  }

  deleteTask(id: number) {
    this.api.deleteTask(id).subscribe({
      next: (res) => {
        this.getAllTasks();
      },
      error: () => {
        alert('Error while deleting the task');
      },
    });
  }

  checkboxLabel(row: any, isChecked: any) {
    if (!isChecked.checked) {
      row.isDone = false;
    } else {
      row.isDone = true;
    }

    this.api.putTask(row, row.id).subscribe({
      next: (res) => {},
      error: () => {
        alert('Error while updating');
      },
    });
  }
}
