var sudokuSolver = undefined;


function sudokuSolverMain() {
	        var sudokuCanvas;
	        var sudoku3D;
	
	         // singleton
	         if (sudokuSolver !== undefined) return;
	
	        sudokuCanvas = document.getElementById("canvas");
           // sudokuCanvas.height = window.innerHeight - sudokuCanvas.getBoundingClientRect().top - 10;
            sudokuCanvas.width = window.innerWidth - 20;
            sudokuCanvas.height = sudokuCanvas.width;
            
            sudoku3D = new Canvas3D(sudokuCanvas);
            sudokuSolver  = new SudokuSolver();
            sudokuSolver.init(sudoku3D);
            
            //console.log("adding buttons");
            var table = document.createElement("table");
            //console.log("created table:" + table);
            table.setAttribute("border", 2);
            table.setAttribute("align", "center");
            table.setAttribute("width", "50%");
            //console.log("init table");
            var count = 1;
            for(var i = 0; i < 3; i++) {
            	var tr = document.createElement("tr");
                for(var j = 0; j < 3; j++) {
                	//console.log("creating bt" + count + "...");
                	var td =document.createElement("td");
                    var bt = document.createElement("button");
                    bt.appendChild(document.createTextNode(count));
                    bt.setAttribute("id", "bt" + count);
                    bt.setAttribute("onClick",  "sudokuSolver.setCurrentCellValue(" + count + ")");
                    bt.setAttribute("style", "width:100%");
                    td.appendChild(bt);
                    tr.appendChild(td);
                    //console.log("created bt" + count);
                    count++;
                	}
                table.appendChild(tr);
            	}
            var tr = document.createElement("tr");
            var td = document.createElement("td");
            var bt = document.createElement("button");
             bt.appendChild(document.createTextNode("C"));
             bt.setAttribute("id", "btC");
             bt.setAttribute("onClick",  "sudokuSolver.clearCurrentCell()");
             bt.setAttribute("style", "width:100%");
             td.appendChild(bt);
             tr.appendChild(td);
             td = document.createElement("td");
             tr.appendChild(td);
             td = document.createElement("td");
             bt = document.createElement("button");
             bt.appendChild(document.createTextNode("!?!"));
             bt.setAttribute("id", "btSolve");
             bt.setAttribute("onClick",  "sudokuSolver.solve()");
             bt.setAttribute("style", "width:100%");
             td.appendChild(bt);
             tr.appendChild(td);
             table.appendChild(tr);
            //console.log(table);
            document.body.appendChild(table);
}

function SudokuSolver() {
	this.resolving = false;
	this.board = undefined;
	this.canvas = undefined;
	this.canvas3D = undefined;
	this.cells = {
		width  : -1
		,height : -1
		,array : []
		,rows : []
		,cols : []
		,squares : []
		,statics: []
		,solved: []
		,at : function(col, row) {
			return array[col + row*9];
			}
		};
		
     this.context = {
     	row: -1,
         col: -1
     	};
		
      this.solveCount = 0;
	  
	  for(var row = 0; row < 9; row++) {
		    this.cells.rows[row] = [];
			for(var col = 0; col < 9; col++) {
			  if(this.cells.cols[col] == undefined) {
				this.cells.cols[col] = [];
				}
			  var cell = {
				val: 0,
				possibles: [1,2,3,4,5,6,7,8,9],
				row: row,
				col: col,
				square: Math.trunc(row/3)*3
				             +Math.trunc(col/3),
				static:false,
				solved:false,
				toString: function() {
					return "cell(" + this.row + "," + this.col + "," + this.square + ")\n   = " + this.val + " [" + this.possibles.join(",") + "]";
					}
				};
			  if (this.cells.squares[cell.square] == undefined) {
				this.cells.squares[cell.square] = [];
				}
			
			  this.cells.array.push(cell);
			  this.cells.rows[row].push(cell);
			  this.cells.cols[col].push(cell);
			  this.cells.squares[cell.square].push(cell);
			}
		}
	}

SudokuSolver.prototype.getCell = function(row, col) {
	return this.cells.array[row * 9 + col];
	}


SudokuSolver.prototype.setCellValue = function(row, col, val, state) {
	if (!Number.isInteger(val)) throw "not integer:" + val;
	if (val <1 || val > 9) throw "bad value:"+val;
	
	var cell = this.cells.array[row * 9 + col];
	
	for(var i = 0; i < 9; i++) {
		if (this.cells.rows[cell.row][i].val === val) throw this.cells.rows[cell.row][i];
		if (this.cells.cols[cell.col][i].val === val) throw this.cells.cols[cell.col][i];
		if (this.cells.squares[cell.square][i].val === val) throw this.cells.squares[cell.square][i];
		}
		
    
	cell.val = val;

	cell.static = state;
	if (cell.static && this.cells.statics.indexOf(cell) == -1) {
		this.cells.statics.push(cell);
		}
	this.redraw();
	}
	
SudokuSolver.prototype.setCurrentCellValue = function(val) {
	try {
	   this.setCellValue(this.context.row, this.context.col, val, true);
	   } catch(e) {
		//console.log("catch:" + e);
	   } finally {
		 // this.redraw();
	   }
	}
	
SudokuSolver.prototype.setCell = function(cell, val) {
		this.setCellValue(cell.row, cell.col, val, cell.static);
	}
	
SudokuSolver.prototype.clearCell = function(row, col) {
	cell = this.cells.array[row * 9 + col];
	if (cell.static) {
		this.cells.statics.splice(
            this.cells.statics.indexOf(cell),
            1);
		}
		
    cell.val = 0;
	cell.static = false;
	
	this.redraw();
	}

SudokuSolver.prototype.clearCurrentCell = function() {
	this.clearCell(this.context.row, this.context.col);
	}

SudokuSolver.prototype.redraw = function() {
	
	if(this.board === undefined) return;
	
    this.board.clearRect(0, 0, this.canvas.width, this.canvas.height);
	this.board.save();
	
	
	var row, col;
	var i;
	////console.log("grid");
	for(i = 0; i < 10; i++) {
		////console.log("i = " + i);
		this.board.beginPath();
		row =  i*this.cells.height;
		col = i*this.cells.width;
		this.board.lineWidth = (((i%3) === 0)?5:1);
		////console.log("row=" + row +",col=" +col);
		this.board.moveTo(0, row);
		this.board.lineTo(this.canvas.width, row);
		this.board.moveTo(col, 0);
		this.board.lineTo(col, this.canvas.height);
		
		this.board.closePath();
		
		this.board.stroke();
		}
    this.board.restore();
    if (this.context.row != -1 && this.context.col != -1) {
       this.fillCell(
            this.context.row
           , this.context.col
           ,"#0f0"
           );
        }
    for(row = 0; row < 9; row++) {
    	for(col = 0; col < 9; col ++) {
    	    this.showCell(row, col);
    	    }
    	}
   }

SudokuSolver.prototype.init = function(canvas3D) {
	this.board = canvas3D.c3d;
	this.canvas = canvas3D.canvas;
	this.canvas3D = canvas3D;
	this.cells.width  = this.canvas.width/9;
	this.cells.height = this.canvas.height/9;
	////console.log("clear");
	
    this.redraw();
        
    var that = this;
    this.canvas.onclick = function(event) {
       that.clickHandler(event);
       };
	}
	
	SudokuSolver.prototype.showCell = function(row, col) {
		this.board.save();
    
    	var cell = this.getCell(row, col);
        if (cell.val >0 && cell.val < 10) {
           var ink = "";
           if (cell.static) {
           	ink = "bold ";
           	this.board.fillStyle = "#700";
           	}
           this.board.font = ink + "32px Arial";
           this.board.fillText(cell.val
                   , (col + .2) * this.cells.width
                   , (row + .8) * this.cells.height);
           } else if (this.resolving) {
           	//console.log("p for " + cell);
           	this.board.font = "13px Arial";
               for(var idx = 0; idx < cell.possibles.length; idx++) {
               	var x = (idx % 3) * (10 + 2);
                   var y = Math.trunc(idx / 3) * (10 + 2);
                   //console.log("idx:"+idx+"("+x+","+y+")");
               	this.board.fillText(cell.possibles[idx]
                       , (col + .1) * this.cells.width + x
                       , (row + .3) * this.cells.height + y);
           	}
           }
         
    	    
         this.board.restore();
    };
	
	SudokuSolver.prototype.clickHandler = function(event) {
        var bb = this.canvas.getBoundingClientRect(); 
         // Convert mouse event coordinates to canvas coordinates
        var x = (event.clientX-bb.left) * (this.canvas.width/bb.width);
        var y = (event.clientY-bb.top) * (this.canvas.height/bb.height);
 
        var col = Math.trunc(x/this.cells.width);
        var row = Math.trunc(y/this.cells.height);
       
        this.context.row = row;
        this.context.col = col;

        /*
        this.fillCell(
            row
           , col
           ,"#0f0"
           );
        
        this.showCell(row, col);
        */
        
        this.redraw();
        
        
        
        //console.log("filled at (" + row + "," + col + ")");
		};
		
SudokuSolver.prototype.fillCell = function(iRow, iCol, style) {
	    this.board.save();
        this.board.fillStyle = style;
        this.board.beginPath();
        this.board.moveTo(iCol*this.cells.width+3, iRow*this.cells.height+3);
        this.board.lineTo((iCol+1)*this.cells.width-3, iRow*this.cells.height +3);
        this.board.lineTo((iCol+1)*this.cells.width-3, (iRow+1)*this.cells.height -3);
        this.board.lineTo((iCol)*this.cells.width+3, (iRow+1)*this.cells.height -3);
        this.board.fill();
        this.board.restore();
	};

SudokuSolver.prototype.copy = function(base) {
	var copy = new SudokuSolver();
	var fromCells = base.cells.array;
	var toCells = copy.cells.array;
	
	for (fromCell of fromCells) {
		copy.setCell(fromCell, fromCell.val);
		var toCell = toCells[fromCell.row * 9 + fromCell.col];
        toCell.possibles = fromCell.possible.slice(0);
		}
	}
	
SudokuSolver.prototype.solve = function() {
	console.log("SudokuSolver.solve() to implement");
	try {
	this.context.row = -1;
	this.context.col =  -1;
	this.resolving = true;
	
    this.solveArray =[];
	
	
    // compute manually entered cells
    for(var cell of this.cells.statics) {
		this.solveFromSolvedCell(cell);
		}
	
	do {
		this.solveCount = 0;
		
	     //check uniq value for each
	     // row, call & square
	     for(var cellSets of [this.cells.rows
		              ,this.cells.cols
		              ,this.cells.squares]){
            this.solveUniqInCellSets(cellSets);
            }
        
        
      console.log("solveCount:"+ this.solveCount);
	} while(this.solveCount > 0);
    this.redraw();
    } catch (e) {
			console.log("cannot solve:" + e);
			}
	}
	
	SudokuSolver.prototype.solveFromSolvedCell = function(solvedCell) {
		if (!solvedCell.solved) {
		     solvedCell.possibles = [ solvedCell.val ];
		     solvedCell.solved = true;
		     this.solveCount++;
		}
		//console.log("process staticCell:" + staticCell);
		for(var a of [this.cells.rows[solvedCell.row]
		              ,this.cells.cols[solvedCell.col]
		              ,this.cells.squares[solvedCell.square]]
            ){
            	for(var cell of a) {
            	   //console.log("update cell ? :" + cell);
            	   if (cell !== solvedCell) {
            	       var idx = cell.possibles.indexOf(solvedCell.val);
                       //console.log("idx = " + idx);
                       if(idx >= 0) {
                       	cell.possibles.splice(idx, 1);
                           //this.solveCount++;
                           //console.log("updated cell ! :[" + cell.possibles.join(',') + "]"+ cell.possibles.length);
                           if(cell.possibles.length ===1) {
                           	try {
                                this.setCell(cell, cell.possibles[0]);
                                this.solveFromSolvedCell(cell);
                                //this.solveArray.push(cell);
                                //this.solveCount++;
                                } catch(e) {
                                	console.log("could not set cell:" + e);
                                	}
                                }
                       	}
            	   }
            	}
			}
		}
		
SudokuSolver.prototype.solveUniqInCellSets = function(cellSets) {
    for(var cellSet of cellSets) {
            var k=[];
        	for(var cell of cellSet) {
        	    for(p of cell.possibles) {
        	        if (k[p] === undefined) {
        	             k[p] = [];
        	          }
                    k[p].push(cell);
                    }
        	    }
                for(var val in k) {
                	//console.log("val:"+val+",l:"+k[val].length);
                	if (k[val].length === 1) {
                	   var c = k[val][0];
                       if(c.val === 0) {
                         //console.log("solving:"+c+",val:"+val);
                         this.setCell(c, Number(val));
                	     this.solveFromSolvedCell(c);
                         }
                	}
                }
        	}
        }
