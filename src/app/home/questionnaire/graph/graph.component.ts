import {Component, OnInit} from '@angular/core';
import {FormService} from '../../../services/form.service';
import {FormSubmission} from '../../../models/FormSubmission';
import {Chart} from '../../../../../node_modules/chart.js';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit{
  chart:Chart = [];
  xyisPoints;
  rating1=[];rating2=[];rating3=[];rating4=[];rating5=[];rating6=[];rating7=[];rating8=[];rating9=[];rating10=[];
  submittedForms;
  constructor(private formService: FormService){}

  ngOnInit () {
    this.formService.getSubmittedForms().subscribe(
      (response:FormSubmission []) => {
        this.submittedForms = response;
        this.chart = this.createChart('canvas',
          this.submittedForms,
          {borrowerRating: this.formService.formSubmission.borrowerRating,pdScore:this.formService.formSubmission.score});
      },
      (error) =>{
        console.log('submitted forms fetching failed' +error);
      }
    );
  }

  createChart(ctx,submittedForms,registeredFormData): Chart{
    this.xyisPoints = [{x:0,y:0},{x:1,y:0},{x:2,y:0},{x:3,y:0},{x:4,y:0},{x:5,y:0},{x:6,y:0},{x:7,y:0},{x:8,y:0},{x:9,y:0},{x:10,y:0}];
    const myRegisteredFormData = [{x:registeredFormData.borrowerRating,y:registeredFormData.pdScore}];
    const point = 5;
    for (let i=0;i<submittedForms.length;i++){
      switch(submittedForms[i].borrowerRating) {
        case 1:
          this.rating1.push({x:submittedForms[i].borrowerRating,y:submittedForms[i].pdScore});
          break;
        case 2:
          this.rating2.push({x:submittedForms[i].borrowerRating,y:submittedForms[i].pdScore});
          break;
        case 3:
          this.rating3.push({x:submittedForms[i].borrowerRating,y:submittedForms[i].pdScore});
          break;
        case 4:
          this.rating4.push({x:submittedForms[i].borrowerRating,y:submittedForms[i].pdScore});
          break;
        case 5:
          this.rating5.push({x:submittedForms[i].borrowerRating,y:submittedForms[i].pdScore});
          break;
        case 6:
          this.rating6.push({x:submittedForms[i].borrowerRating,y:submittedForms[i].pdScore});
          break;
        case 6:
          this.rating6.push({x:submittedForms[i].borrowerRating,y:submittedForms[i].pdScore});
          break;
        case 8:
          this.rating8.push({x:submittedForms[i].borrowerRating,y:submittedForms[i].pdScore});
          break;
        case 9:
          this.rating9.push({x:submittedForms[i].borrowerRating,y:submittedForms[i].pdScore});
          break;
        case 10:
          this.rating10.push({x:submittedForms[i].borrowerRating,y:submittedForms[i].pdScore});
          break;
      }
    }
    return new Chart(ctx, {
      type: 'scatter',
      data: {
        labels: 'Scatter DataSet',
        datasets: [
          {
            showLine : false,
            label: '',
            data: this.xyisPoints,
            backgroundColor: 'rgba(255, 0, 0, 0)', // Opacity 0--> transparent
            borderColor: 'rgba(255, 0, 0, 0)', // Opacity 0--> transparent
          }
          ,
          {
            showLine : false,
            label: 'Current Assessment',
            data: myRegisteredFormData,
            backgroundColor: 'rgb(0,0,0)', // Black
            borderColor: 'rgb(0,0,0)', // Black
            pointRadius: point
          }
          ,
          {
            showLine : false,
            label: 'Rating 1',
            data: this.rating1,
            backgroundColor: 'rgb(0, 204, 0)', // Dark Green
            borderColor: 'rgb(0, 204, 0)', // Dark Green
            pointStyle: 'cross',
            pointRadius: point
          }
          ,
          {
            showLine : false,
            label: 'Rating 2',
            data: this.rating2,
            backgroundColor: 'rgb(102, 204, 0)', // Light Green
            borderColor: 'rgb(102, 204, 0)', // Light Green
            pointStyle: 'star',
            pointRadius: point
          }
          ,
          {
            showLine : false,
            label: 'Rating 3',
            data: this.rating3,
            backgroundColor: 'rgb(221, 255, 51)', // Light Green with yellow tint
            borderColor: 'rgb((221, 255, 51)', // Light Green with yellow tint
            pointStyle:'circle',
            pointRadius: point
          }
          ,
          {
            showLine : false,
            label: 'Rating 4',
            data: this.rating4,
            backgroundColor: 'rgb(255, 255, 179)', // Bright Yellow
            borderColor: 'rgb(255, 255, 179)', // Bright Yellow
            pointRadius: point
          }
          ,
          {
            showLine : false,
            label: 'Rating 5',
            data: this.rating5,
            backgroundColor: 'rgb(255, 225, 71)', // Yellow
            borderColor: 'rgb(255, 225, 71)', // Yellow
            pointStyle: 'rect',
            pointRadius: point
          }
          ,
          {
            showLine : false,
            label: 'Rating 6',
            data: this.rating6,
            backgroundColor: 'rgb(255, 178, 102)', // Light Orange
            borderColor: 'rgb(255, 178, 102)', // Light Orange
            pointStyle: 'circle',
            pointRadius: point
          }
          ,
          {
            showLine : false,
            label: 'Rating 7',
            data: this.rating7,
            backgroundColor: 'rgb(255, 128, 0)', // Dark Orange
            borderColor: 'rgb(255, 128, 0)', // Dark Orange
            pointStyle: 'triangle',
            pointRadius: point
          }
          ,
          {
            showLine : false,
            label: 'Rating 8',
            data: this.rating8,
            backgroundColor: 'rgb(243, 114, 88)', // Light Red
            borderColor: 'rgb(243, 114, 88)', // Light Red
            pointStyle: 'rectRot',
            pointRadius: point
          }
          ,
          {
            showLine : false,
            label: 'Rating 9',
            data: this.rating9,
            backgroundColor: 'rgb(255, 102, 102)', // Mid Red
            borderColor: 'rgb(255, 102, 102)', // Mid Red
            pointRadius: point
          }
          ,
          {
            showLine : false,
            label: 'Rating 10',
            data: this.rating10,
            backgroundColor: 'rgb(204,0,0)', // Dark Red
            borderColor: 'rgb(204,0,0)', // Dark Red
            pointRadius: point
          }

        ],
      },
      options: {
        responsive: true,
        legend: {
          position: 'bottom',
        },
        hover: {
          mode: 'index'
        },
        scales: {
          xAxes: [{
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Borrower Rating'
            }
          }],
          yAxes: [{
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Assessment Score'
            }
          }]
        },
        title: {
          fontSize: 30,
          display: true
          ,text: ['Score distribution per borrower rating','(Higher score means lower PD)']
        }
      }
    });
  }
}
