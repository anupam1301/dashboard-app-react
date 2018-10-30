import React, { Component } from 'react';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import csv from 'csv';
import $ from 'jquery';
import {VictoryChart,VictoryAxis,VictoryBar,VictoryPie,VictoryLabel,VictoryTheme} from 'victory';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

class Dashboard extends Component {

    componentWillMount(){
        let sessId=sessionStorage.getItem("sessId");

        if(!sessId){
            alert("User Unauthorized. Redirecting to Login page.");
            this.props.history.push("/");
        }

    }

    componentDidMount(){
        try{
            if(!localStorage.mapdata){
                $('#piechart').hide();
            }
        }catch(e){};

        this.formSubmit();

        this.dispList();


    }

    constructor(props){
        super(props);
        this.state={
            data:[
                {users: 1, count: 0},
                {users: 2, count: 0}
            ],
            platform:'site',
            totalUids:0,
            totalUuids:0

        }

    }

    dispList(){debugger;
        document.getElementById('ulist').innerText='';
        let userList=localStorage.mapdata?JSON.parse(localStorage.mapdata):[];
        let count =0;


        // while(count<=10){
            for (var j = 0; j < userList.length; j++) {
                // debugger;
                if (userList[j].platform && this.state.platform === userList[j].platform && count<10) {


                    document.getElementById('ulist').innerHTML +=`<p id="listcard" class='card'> User: ${userList[j].uid} </p>\n`;
                    count +=1;

                }
            }
        // }
        ;


    }

    onLogout(){
        if(sessionStorage.sessId) {
            sessionStorage.removeItem('sessId');
            this.props.history.push("/");
            $('#logout').hide();
            alert("Successfully Logged out.");
        }
    }

    handlePdfDownload(){

        let data = localStorage.arrData?JSON.parse(localStorage.getItem("arrData")):[];
        let docContent = '';
        data.forEach((row) => {
            docContent += row.join(',') + '\r\n';
        });


        pdfMake.createPdf({
            content: docContent
        }).download();


    }

    handleDownload(){
        const stringify = require('csv-stringify');
        let data=localStorage.arrData?JSON.parse(localStorage.getItem("arrData")):[];

        stringify(data, function(err, output){

            let csv = "data:text/csv;charset=utf-8," + output;
            // window.open(encodeURI(csv));
            var encodedUri = encodeURI(csv);
            var link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "my_data.csv");
            document.body.appendChild(link); // Required for FF

            link.click();
        })

    }

    countCalculate(self, cb){

        if(localStorage.getItem("mapdata")) {
            let mapData = localStorage.mapdata?JSON.parse(localStorage.mapdata):[];

            let tuidFilter = mapData.filter((obj) => {
                return obj.platform === self.state.platform;
            }).length;

            let tempMap = {};
            let tuuidFilter = mapData.reduce((count, obj) => {

                if (self.state.platform === obj.platform) {

                    if (tempMap[obj.uid]) {
                        return count;
                    } else {
                        tempMap[obj.uid] = true;

                        return count + 1;
                    }
                }
                return count;
            }, 0);

            // let sharedIds = ((tuuidFilter / tuidFilter) * 100);

            self.setState({

                totalUids: tuidFilter,
                totalUuids: tuuidFilter
            }, () => {
                cb();
            });
        }else{
            self.setState({

                totalUids: 0,
                totalUuids: 0
            }, () => {
                cb();
            });
        }
    }

    processData(data){
        let self=this;
        let keys=data.splice(0,1)[0];

        let mapData=data.map((row)=>{
            let obj={};
            obj[keys[0]]=row[0];
            obj[keys[1]]=row[1];
            return obj;
        });
        console.log(mapData);

        localStorage.setItem("mapdata",JSON.stringify(mapData));

        self.countCalculate(self, () => {});

    }

    getFileName(){debugger;
        let fileName=((document.getElementById("uploadCsv").value).split('\\'))[2];
        document.getElementById('uplist').innerHTML +=`<p id="listcard2" class='card'> File: ${fileName} <span id="stat">   pending..</span> </p>\n`;

    }

    processUpload(e) {

        this.getFileName();

        let self=this;
        let reader= new FileReader();
        $('.loader').show();
        $(' #loadtext').show();
        reader.onload=(ev)=>{

            csv.parse(ev.target.result,(err,dat)=>{
                if(err){
                    throw err;
                    $('.loader').hide();
                    $(' #loadtext').hide(()=>{alert("Upload Failed.")});
                }else{
                    localStorage.setItem("arrData",JSON.stringify(dat));

                    self.processData(dat);

                    self.formSubmit(e);

                    $('.loader').hide();
                    $(' #loadtext').hide(()=>{alert("Upload Successful.")});
                    $('#stat').html('completed.');


                    //console.log(dat);
                }
            });


            // console.log(ev.target.result);
        };
        reader.readAsText(e.nativeEvent.target.files[0]);

    }

    formSubmit(e){
        try {
            e.preventDefault();
        }catch(er){}

        let self=this;

        // self.countCalculate(mapData,self);
        let dropdownValue = document.getElementsByTagName("select")[0].value;
        if(dropdownValue === "Site"){
            self.setState({
                platform:"site"
            }, () => {
                this.dispList();
                self.countCalculate(self, ()=> {
                    self.setState({
                        data:[
                            {users: 1, count: this.state.totalUids},
                            {users: 2, count: this.state.totalUuids}
                        ]
                    });
                });

            });



        }else{
            self.setState({
                platform:"android"
            }, () => {
                this.dispList();
                self.countCalculate(self, () => {
                    self.setState({
                        data:[
                            {users: 1, count: this.state.totalUids},
                            {users: 2, count: this.state.totalUuids}
                        ]
                    });
                });

            });

        }


    }

    render() {
        return (

            <div>
                <div className="loader hide"></div>
                <p className="hide" id="loadtext">loading...</p>
                {/*<a className="hide"></a>*/}
                <div className="center-on-page">
                    <h2 id="dashHead">Welcome to the Dashboard</h2>
                    <p id="selectText">Upload CSV and Select Platform</p>
                    <form  id="selectForm" onSubmit={(e)=>{this.formSubmit(e)}} >
                        <select className="custom-select" name="Platforms">
                            <option value="Site" >Site</option>
                            <option value="Android">Android</option>
                        </select>
                        <br /><br />
                        <input id="submit" type="submit" />
                    </form>
                    <button id="logout" onClick={()=>this.onLogout()}>Logout</button>

                </div>

                <div id="chart">
                    <VictoryChart
                        // domainPadding will add space to each side of VictoryBar to
                        // prevent it from overlapping the axis
                        theme={VictoryTheme.material}
                        domainPadding={20}

                    >
                        <VictoryAxis
                            // tickValues specifies both the number of ticks and where
                            // they are placed on the axis
                            tickValues={[1, 2]}
                            tickFormat={["Total Users", "Total Unique Users"]}
                        />
                        <VictoryAxis
                            dependentAxis
                            // tickFormat specifies how ticks should be displayed
                            tickFormat={(x) => (`${x}`)}
                        />
                        <VictoryBar
                            barWidth={20}
                            labels={(d) => d.count}
                            style={{ labels: { fill: 'darkslategrey' } }}
                            labelComponent={<VictoryLabel dy={5}/>}
                            data={this.state.data}
                            x="users"
                            y="count"
                        />
                    </VictoryChart>

                    <div id="piechart">
                        <VictoryPie
                            height={200}

                            colorScale={["tomato", "orange"]}
                            data={[
                                { x: "Total Users", y: this.state.totalUids },
                                { x: "Total Unique Users", y: this.state.totalUuids }
                            ]}
                        />
                    </div>



                </div>

                <div id="piechart"></div>
                <div id="userlist" className="card"><h4 id="h4">User List</h4><ul id="ulist"></ul></div>
                <div id="uploadlist" className="card"><h4 id="h4">Upload Status</h4><ul id="uplist"></ul></div>

                <div id="buttons">
                    <button className="exButton" onChange={(e)=>{this.processUpload(e)}}><input id="uploadCsv" type="file" />Upload CSV</button>
                    <button className="exButton" onClick={()=>this.handleDownload()}>Download CSV</button>
                    <button className="exButton" onClick={()=>this.handlePdfDownload()}>Download PDF</button>
                </div>
            </div>
        );
    }
}

export default Dashboard;
