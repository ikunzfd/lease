package com.zfd.lease.web.app.service;

public interface SmsService {

    void sendCode(String phone ,String code) throws Exception;
}
