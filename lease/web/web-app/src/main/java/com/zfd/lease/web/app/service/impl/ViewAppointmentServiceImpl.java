package com.zfd.lease.web.app.service.impl;

import com.zfd.lease.common.exception.LeaseException;
import com.zfd.lease.common.login.LoginUserHolder;
import com.zfd.lease.common.result.ResultCodeEnum;
import com.zfd.lease.model.entity.ViewAppointment;
import com.zfd.lease.web.app.mapper.ViewAppointmentMapper;
import com.zfd.lease.web.app.service.ApartmentInfoService;
import com.zfd.lease.web.app.service.ViewAppointmentService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.zfd.lease.web.app.vo.apartment.ApartmentItemVo;
import com.zfd.lease.web.app.vo.appointment.AppointmentDetailVo;
import com.zfd.lease.web.app.vo.appointment.AppointmentItemVo;
import jakarta.annotation.Resource;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @author liubo
 * @description 针对表【view_appointment(预约看房信息表)】的数据库操作Service实现
 * @createDate 2023-07-26 11:12:39
 */
@Service
public class ViewAppointmentServiceImpl extends ServiceImpl<ViewAppointmentMapper, ViewAppointment>
        implements ViewAppointmentService {

    @Resource
    private ViewAppointmentMapper viewAppointmentMapper;

    @Autowired
    private ApartmentInfoService apartmentInfoService;

    @Override
    public List<AppointmentItemVo> listItemByUserId(Long userId) {
        return viewAppointmentMapper.listItemByUserId(userId);
    }

    @Override
    public AppointmentDetailVo getDetailById(Long id) {

        ViewAppointment viewAppointment = viewAppointmentMapper.selectById(id);
        if (viewAppointment == null) {
            return null;
        }
        // 验证数据所有权
        Long userId = LoginUserHolder.getLoginUser().getUserId();
        if (!viewAppointment.getUserId().equals(userId)) {
            throw new LeaseException(ResultCodeEnum.ILLEGAL_REQUEST);
        }

        ApartmentItemVo apartmentItemVo = apartmentInfoService.selectApartmentItemVoById(viewAppointment.getApartmentId());

        AppointmentDetailVo agreementDetailVo = new AppointmentDetailVo();
        BeanUtils.copyProperties(viewAppointment, agreementDetailVo);

        agreementDetailVo.setApartmentItemVo(apartmentItemVo);

        return agreementDetailVo;
    }
}




