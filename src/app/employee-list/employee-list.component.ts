import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Employee } from '../employee'
import { EmployeeService } from '../employee.service'
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit,OnDestroy {
  
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  employees: Employee[];
  dtoptions: DataTables.Settings = {};
  dttrigger:Subject<any> = new Subject<any>();


  constructor(private employeeService: EmployeeService,
    private router: Router) { }

  ngOnInit(): void {
    this.dtoptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      lengthMenu:[5,10,15,20],
      // processing: true,
       
    };
    this.getEmployees();
    
  }

  
  

  // private getEmployees(){
  //   this.employeeService.getEmployeesList().subscribe(data => {
  //     this.employees = data;
  //     this.dttrigger.next(null);
  //   });
  // }

  private getEmployees(): void {
    this.employeeService.getEmployeesList().subscribe(data => {
      this.employees = data;
      if (this.datatableElement && this.datatableElement.dtInstance) {
        this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
          // Destroy the DataTable instance
          dtInstance.destroy();
          // Call next to trigger reinitialization
          this.dttrigger.next(null);
        });
      } else {
        this.dttrigger.next(null);
      }
    });
  }

  employeeDetails(id: number){
    this.router.navigate(['employee-details', id]);
  }

  updateEmployee(id: number){
    this.router.navigate(['update-employee', id]);
  }

  deleteEmployee(id: number){
    this.employeeService.deleteEmployee(id).subscribe( data => {
      console.log(data);
      this.getEmployees();
      
    })
    
  }

  ngOnDestroy(): void {
    this.dttrigger.unsubscribe();
  }

  // page: number = 1;
  // count: number = 0;
  // tableSize:number = 5;
  // tableSizes: any = [5, 10, 15, 20 ];
  
  // onTableDataChange(e:any){
  //   this.page=e;
  //   this.getEmployees();
  // }

  // onTableSizeChange(e:any): void{
  //   this.tableSize = e.target.value;
  //   this.page=1;
  //   this.getEmployees();
  // }

  // searchText: any;
  
  
}
