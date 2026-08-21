package com.__Y2_S1_MLB_B10G1_05.demo.payroll;

import com.__Y2_S1_MLB_B10G1_05.demo.common.exception.ResourceNotFoundException;
import com.__Y2_S1_MLB_B10G1_05.demo.employee.Employee;
import com.__Y2_S1_MLB_B10G1_05.demo.employee.EmployeeService;
import com.__Y2_S1_MLB_B10G1_05.demo.payroll.dto.PayrollRequest;
import com.__Y2_S1_MLB_B10G1_05.demo.payroll.dto.PayrollResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class PayrollService {

    private final PayrollRepository payrollRepository;
    private final EmployeeService employeeService;

    public List<PayrollResponse> getAll() {
        return payrollRepository.findAll().stream()
                .map(PayrollResponse::fromEntity)
                .toList();
    }

    public List<PayrollResponse> getByEmployee(Long employeeId) {
        return payrollRepository.findByEmployee_EmployeeId(employeeId).stream()
                .map(PayrollResponse::fromEntity)
                .toList();
    }

    public PayrollResponse getById(Long id) {
        return PayrollResponse.fromEntity(findEntity(id));
    }

    private Payroll findEntity(Long id) {
        return payrollRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payroll record not found with id: " + id));
    }

    public PayrollResponse create(PayrollRequest request) {
        Employee employee = employeeService.findEntity(request.getEmployeeId());
        double allowances = request.getAllowances() != null ? request.getAllowances() : 0.0;
        double deductions = request.getDeductions() != null ? request.getDeductions() : 0.0;
        double net = request.getBasicSalary() + allowances - deductions;

        Payroll payroll = Payroll.builder()
                .employee(employee)
                .basicSalary(request.getBasicSalary())
                .allowances(allowances)
                .deductions(deductions)
                .netSalary(net)
                .payPeriodStart(request.getPayPeriodStart())
                .payPeriodEnd(request.getPayPeriodEnd())
                .paymentStatus(PaymentStatus.PENDING)
                .build();

        return PayrollResponse.fromEntity(payrollRepository.save(payroll));
    }

    public PayrollResponse markAsPaid(Long id) {
        Payroll payroll = findEntity(id);
        payroll.setPaymentStatus(PaymentStatus.PAID);
        payroll.setPaymentDate(LocalDate.now());
        return PayrollResponse.fromEntity(payrollRepository.save(payroll));
    }
}
