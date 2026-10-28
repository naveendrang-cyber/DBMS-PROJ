package com.omnimarket.da3.dto;

import java.util.ArrayList;
import java.util.List;

public class TransactionDemoRequest {
    private boolean shouldFail;

    public boolean isShouldFail() { return shouldFail; }
    public void setShouldFail(boolean shouldFail) { this.shouldFail = shouldFail; }
}
