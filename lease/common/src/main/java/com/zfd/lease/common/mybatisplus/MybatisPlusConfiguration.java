package com.zfd.lease.common.mybatisplus;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.context.annotation.Configuration;

@Configuration
@MapperScan("com.zfd.lease.web.*.mapper")
public class MybatisPlusConfiguration {

}
