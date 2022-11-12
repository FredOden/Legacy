package com.lourah.badak;

import org.mozilla.javascript.*;

public class Rhino implements BadakEngine {
  private  Context cx;
  private  Scriptable scope;

  
  public void begin() {
    this.cx = Context.enter();
    this.cx.setOptimizationLevel(-1);
    scope = this.cx.initStandardObjects();
  }
  
  public String eval(String s) {
    String ret;
    Object res = cx.evaluateString(scope, s, "rhinotest", 1, null);
    ret = Context.toString(res);
    System.err.println("eval(" + s+ ") +>" + ret);
    return ret;
  }
  
  public void end() {
    Context.exit();
  }
}
