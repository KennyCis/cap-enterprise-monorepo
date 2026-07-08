package com.cap.scheduleservice.service;

import com.cap.scheduleservice.model.Schedule;
import com.cap.scheduleservice.repository.ScheduleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ScheduleService {

    private final ScheduleRepository scheduleRepository;

    @Autowired
    public ScheduleService(ScheduleRepository scheduleRepository) {
        this.scheduleRepository = scheduleRepository;
    }

    public List<Schedule> getAllSchedules() {
        return scheduleRepository.findAll();
    }

    // Crear un nuevo horario
    public Schedule createSchedule(Schedule schedule) {
     
        return scheduleRepository.save(schedule);
    }

    // Delete
    public void deleteSchedule(Long id) {
        scheduleRepository.deleteById(id);
    }
}