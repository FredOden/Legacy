package com.lourah.badak;


public class Badak {

  public static void main(String[] args) {

    System.out.println("Rhino test by Lourah");
    
    
    BadakEngine interpreter;
    
    
    
    interpreter = new Rhino();
    
    interpreter.begin();
    
    String result = interpreter.eval("var a = 7*8;");
    result = interpreter.eval("a - 1;");
    interpreter.end();
    
    System.out.println("interpreter:" + result);
    
  }
}
