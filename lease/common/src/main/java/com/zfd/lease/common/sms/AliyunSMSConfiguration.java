package com.zfd.lease.common.sms;

import com.aliyun.dypnsapi20170525.Client;
import com.aliyun.teaopenapi.models.Config;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * 阿里云短信客户端配置
 */
@Configuration
@EnableConfigurationProperties(AliyunSMSProperties.class)
@ConditionalOnProperty(name = "aliyun.sms.endpoint")
public class AliyunSMSConfiguration {

    @Autowired
    private AliyunSMSProperties smsProperties;

    @Bean
    @ConditionalOnMissingBean
    public Client aliyunSmsClient() throws Exception {
        // 1. 校验必填参数
        if (smsProperties.getEndpoint() == null
                || smsProperties.getSignName() == null
                || smsProperties.getTemplateCode() == null) {
            throw new IllegalArgumentException("阿里云短信认证：endpoint、signName、templateCode不能为空！");
        }

        // 2. 初始化配置
        Config config = new Config()
                .setAccessKeyId(smsProperties.getAccessKeyId())
                .setAccessKeySecret(smsProperties.getAccessKeySecret())
                .setEndpoint(smsProperties.getEndpoint())
                .setConnectTimeout(smsProperties.getConnectTimeout())
                .setReadTimeout(smsProperties.getReadTimeout());

        // 3. 配置Credentials（使用完全限定名）
        com.aliyun.credentials.Client credential = new com.aliyun.credentials.Client();
        config.setCredential(credential);

        // 4. 创建并返回客户端
        return new Client(config);
    }
}
