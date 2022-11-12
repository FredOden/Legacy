/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function Area3D(a, b ,c) {

    this.setABC(a, b, c);

}


Area3D.prototype.setABC = function(a, b, c) {

    this.a = a; //new P3D(a);

    this.b = b; //new P3D(b);

    this.c = c; //new P3D(c);

    this.geometry = undefined;
    this.zOrder = undefined;
    
    return this;
};


Area3D.prototype.getGeometry = function() {

    if (this.geometry === undefined) {

     v1 =  (new V3D(this.a, this.b)).normalize(1);

     v2 = (new V3D(this.a, this.c)).normalize(1);

     this.geometry = {g: (new P3D()).setXYZ(

             (this.a.x + this.b.x + this.c.x)/3

            ,(this.a.y + this.b.y + this.c.y)/3

            ,(this.a.z + this.b.z + this.c.z)/3)

            ,

        v1: v1,

        v2: v2,

        vOrtho : V3D.vectorProduct(v1, v2),
        
        /*
        zOrder : Math.min.apply(null, [
           a.z
         , b.z
         , c.z])
         */

      };
      

    }

    return this.geometry;

};

Area3D.prototype.getZOrder1 = function(canvas3d) {
      	if(this.zOrder === undefined) {
         	this.zOrder = Math.max.apply(null, [
                canvas3d.transform3D(this.a).pr.z
              , canvas3d.transform3D(this.b).pr.z
              , canvas3d.transform3D(this.c).pr.z]);
           }
           /*
           console.log("a:" + this.a + "->" + this.a.pr);
           console.log("b:" + this.b + "->" + this.b.pr);
           console.log("c:" + this.c + "->" + this.c.pr);
           console.log("zOrder=" + this.zOrder + "[" + this.a.pr.z + ","  + this.b.pr.z + "," +this.c.pr.z +"]");
            */
           return this.zOrder;
};

Area3D.prototype.getZOrder = function(canvas3d) {
      	if(this.zOrder === undefined) {
         	this.zOrder = (
                  canvas3d.transform3D(this.a).pr.z
                +canvas3d.transform3D(this.b).pr.z
                +canvas3d.transform3D(this.c).pr.z)/3
           }
           /*
           console.log("a:" + this.a + "->" + this.a.pr);
           console.log("b:" + this.b + "->" + this.b.pr);
           console.log("c:" + this.c + "->" + this.c.pr);
           console.log("zOrder=" + this.zOrder + "[" + this.a.pr.z + ","  + this.b.pr.z + "," +this.c.pr.z +"]");
            */
           return this.zOrder;
};

Area3D.viewAxis = new V3D(0, 0, 100);

Area3D.prototype.zCompareTo = function(area) {
	return +(Math.abs(this.getGeometry().vOrtho.w)
	           - Math.abs(area.getGeometry().vOrtho.w));
};

Area3D.zCompare = function(area1, area2) {
	//return area1.zCompareTo(area2);
	return area2.getGeometry().zOrder
              - area1.getGeometry().zOrder;
};
	

Area3D.prototype.getLambda = function(v) {

    return V3D.scalarProduct(v, this.getGeometry().vOrtho);

};


