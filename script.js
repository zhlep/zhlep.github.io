function calculate() {
    // 获取输入值
    const principal = parseFloat(document.getElementById('principal').value);
    const rate = parseFloat(document.getElementById('rate').value);
    const time = parseFloat(document.getElementById('time').value);
    const compound = parseInt(document.getElementById('compound').value);
    
    // 清除之前的错误信息
    clearErrors();
    
    // 验证输入
    let isValid = true;
    
    if (isNaN(principal) || principal <= 0) {
        showError('principal', '请输入有效的本金金额（大于0）');
        isValid = false;
    }
    
    if (isNaN(rate) || rate < 0) {
        showError('rate', '请输入有效的年利率（0或正数）');
        isValid = false;
    }
    
    if (isNaN(time) || time <= 0) {
        showError('time', '请输入有效的投资年限（大于0）');
        isValid = false;
    }
    
    if (!isValid) {
        return;
    }
    
    // 计算复利
    // 公式: A = P(1 + r/n)^(nt)
    // A = 最终金额
    // P = 本金
    // r = 年利率 (小数形式)
    // n = 每年复利次数
    // t = 年数
    
    const rateDecimal = rate / 100;
    const finalAmount = principal * Math.pow(1 + rateDecimal / compound, compound * time);
    const interestEarned = finalAmount - principal;
    const roi = (interestEarned / principal) * 100;
    
    // 计算复利效应（相对于单利的额外收益）
    const simpleInterest = principal * rateDecimal * time;
    const compoundEffect = ((interestEarned - simpleInterest) / simpleInterest) * 100;
    
    // 显示结果
    document.getElementById('results').style.display = 'block';
    document.getElementById('result-title').innerHTML = '📊 正向计算结果：<span id="finalAmount">' + formatCurrency(finalAmount) + '</span>';
    document.getElementById('normal-results').style.display = 'block';
    document.getElementById('target-results').style.display = 'none';
    
    document.getElementById('finalAmount').textContent = formatCurrency(finalAmount);
    
    // 显示详细分析
    document.getElementById('summary').style.display = 'block';
    document.getElementById('summary-principal').textContent = formatCurrency(principal);
    document.getElementById('summary-interest').textContent = formatCurrency(interestEarned);
    document.getElementById('summary-effect').textContent = 
        isFinite(compoundEffect) && compoundEffect > 0 ? compoundEffect.toFixed(2) + '%' : 'N/A';
    
    // 滚动到结果区域
    document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
    
    // 添加成功动画
    const resultCards = document.querySelectorAll('.result-card');
    resultCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.transform = 'scale(1.02)';
            setTimeout(() => {
                card.style.transform = 'scale(1)';
            }, 200);
        }, index * 100);
    });
}

function formatCurrency(amount) {
    if (amount >= 10000) {
        return '¥' + (amount / 10000).toFixed(2) + '万';
    } else {
        return '¥' + amount.toLocaleString('zh-CN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }
}

// 添加回车键支持
document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        calculate();
    }
});

// 添加输入验证，防止输入负数
const inputs = ['principal', 'rate', 'time'];
inputs.forEach(id => {
    const input = document.getElementById(id);
    input.addEventListener('input', function(e) {
        // 清除错误信息
        clearErrors();
        
        // 防止负数
        if (this.value < 0) this.value = 0;
        
        // 实时验证
        validateInput(id, this.value);
    });
    
    // 失去焦点时验证
    input.addEventListener('blur', function() {
        validateInput(id, this.value);
    });
});

// 添加复利频率变化时的提示
document.getElementById('compound').addEventListener('change', function() {
    const compoundText = this.options[this.selectedIndex].text;
    showSuccess('compound', `已选择 ${compoundText}`);
});

// 验证单个输入
function validateInput(id, value) {
    const numValue = parseFloat(value);
    
    switch(id) {
        case 'principal':
            if (isNaN(numValue) || numValue <= 0) {
                showError('principal', '请输入有效的本金金额（大于0）');
            }
            break;
        case 'rate':
            if (isNaN(numValue) || numValue < 0) {
                showError('rate', '请输入有效的年利率（0或正数）');
            }
            break;
        case 'time':
            if (isNaN(numValue) || numValue <= 0) {
                showError('time', '请输入有效的投资年限（大于0）');
            }
            break;
    }
}

// 显示错误信息
function showError(fieldId, message) {
    const errorElement = document.getElementById(fieldId + '-error');
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    
    const inputElement = document.getElementById(fieldId);
    inputElement.style.borderColor = 'var(--error-color)';
    inputElement.style.boxShadow = '0 0 0 3px rgba(220, 53, 69, 0.1)';
}

// 显示成功信息
function showSuccess(fieldId, message) {
    const errorElement = document.getElementById(fieldId + '-error');
    errorElement.textContent = message;
    errorElement.style.color = 'var(--success-color)';
    errorElement.style.display = 'block';
    
    const inputElement = document.getElementById(fieldId);
    inputElement.style.borderColor = 'var(--success-color)';
    inputElement.style.boxShadow = '0 0 0 3px rgba(40, 167, 69, 0.1)';
}

// 清除错误信息
function clearErrors() {
    const errorElements = document.querySelectorAll('.input-error');
    errorElements.forEach(element => {
        element.style.display = 'none';
        element.textContent = '';
        element.style.color = 'var(--error-color)';
    });
    
    const inputs = document.querySelectorAll('input[type="number"]');
    inputs.forEach(input => {
        input.style.borderColor = 'var(--border-color)';
        input.style.boxShadow = 'none';
    });
}

// 清空所有输入和结果
function clearAll() {
    // 清空输入
    document.getElementById('principal').value = '';
    document.getElementById('rate').value = '';
    document.getElementById('time').value = '';
    document.getElementById('compound').selectedIndex = 0;
    
    // 清除错误信息
    clearErrors();
    
    // 隐藏结果
    document.getElementById('results').style.display = 'none';
    document.getElementById('summary').style.display = 'none';
    
    // 重置结果值
    document.getElementById('finalAmount').textContent = '¥0.00';
    document.getElementById('interestEarned').textContent = '¥0.00';
    document.getElementById('roi').textContent = '0.00%';
    
    // 添加清空动画
    const btn = document.getElementById('clear-btn');
    btn.style.transform = 'scale(0.95)';
    setTimeout(() => {
        btn.style.transform = 'scale(1)';
    }, 150);
    
    // 聚焦到第一个输入框
    document.getElementById('principal').focus();
}

// 添加页面加载完成后的初始化
document.addEventListener('DOMContentLoaded', function() {
    // 添加页面加载动画
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease-in-out';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
    
    // 添加模式切换事件监听
    const modeRadios = document.querySelectorAll('input[name="calculation-mode"]');
    modeRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            switchMode(this.value);
        });
    });
    
    // 添加键盘快捷键支持
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + Enter 快速计算
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            const currentMode = getCurrentMode();
            if (currentMode === 'normal') {
                calculate();
            } else {
                calculateTarget();
            }
        }
        
        // Esc 清空
        if (e.key === 'Escape') {
            clearAll();
        }
    });
    
    // 添加页面可见性检测
    document.addEventListener('visibilitychange', function() {
        if (document.visibilityState === 'visible') {
            // 页面重新可见时，可以做一些事情，比如重新聚焦
            const activeElement = document.activeElement;
            if (activeElement && activeElement.tagName === 'INPUT') {
                activeElement.focus();
            }
        }
    });
    
    // 添加性能监控
    if (window.performance) {
        window.addEventListener('load', function() {
            const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
            console.log(`页面加载时间: ${loadTime}ms`);
        });
    }
    
    // 初始化时隐藏错误提示
    clearErrors();
});

// 切换计算模式
function switchMode(mode) {
    const normalMode = document.getElementById('normal-mode');
    const targetMode = document.getElementById('target-mode');
    const results = document.getElementById('results');
    
    if (mode === 'normal') {
        normalMode.style.display = 'flex';
        targetMode.style.display = 'none';
        results.style.display = 'none';
        clearErrors();
        clearResults();
    } else {
        normalMode.style.display = 'none';
        targetMode.style.display = 'flex';
        results.style.display = 'none';
        clearErrors();
        clearResults();
    }
}

// 获取当前模式
function getCurrentMode() {
    return document.querySelector('input[name="calculation-mode"]:checked').value;
}

// 清空结果
function clearResults() {
    // 清空正向计算结果
    document.getElementById('finalAmount').textContent = '¥0.00';
    document.getElementById('interestEarned').textContent = '¥0.00';
    document.getElementById('roi').textContent = '0.00%';
    
    // 清空目标计算结果
    document.getElementById('requiredPrincipal').textContent = '¥0.00';
    document.getElementById('targetFinalAmount').textContent = '¥0.00';
    document.getElementById('targetInterestEarned').textContent = '¥0.00';
    
    // 隐藏所有结果区域
    document.getElementById('normal-results').style.display = 'none';
    document.getElementById('target-results').style.display = 'none';
}

// 目标金额计算函数
function calculateTarget() {
    // 获取输入值
    const targetAmount = parseFloat(document.getElementById('targetAmount').value);
    const rate = parseFloat(document.getElementById('targetRate').value);
    const time = parseFloat(document.getElementById('targetTime').value);
    const compound = parseInt(document.getElementById('targetCompound').value);
    
    // 清除之前的错误信息
    clearErrors();
    
    // 验证输入
    let isValid = true;
    
    if (isNaN(targetAmount) || targetAmount <= 0) {
        showError('target-amount', '请输入有效的目标金额（大于0）');
        isValid = false;
    }
    
    if (isNaN(rate) || rate < 0) {
        showError('target-rate', '请输入有效的年利率（0或正数）');
        isValid = false;
    }
    
    if (isNaN(time) || time <= 0) {
        showError('target-time', '请输入有效的投资年限（大于0）');
        isValid = false;
    }
    
    if (!isValid) {
        return;
    }
    
    // 计算所需本金
    // 公式: P = A / (1 + r/n)^(nt)
    // P = 本金
    // A = 目标金额
    // r = 年利率 (小数形式)
    // n = 每年复利次数
    // t = 年数
    
    const rateDecimal = rate / 100;
    const requiredPrincipal = targetAmount / Math.pow(1 + rateDecimal / compound, compound * time);
    const interestEarned = targetAmount - requiredPrincipal;
    
    // 显示结果
    document.getElementById('results').style.display = 'block';
    document.getElementById('result-title').innerHTML = '🎯 目标金额计算结果：<span id="requiredPrincipal">' + formatCurrency(requiredPrincipal) + '</span>';
    document.getElementById('normal-results').style.display = 'none';
    document.getElementById('target-results').style.display = 'block';
    
    document.getElementById('requiredPrincipal').textContent = formatCurrency(requiredPrincipal);
    
    // 显示详细分析
    document.getElementById('target-summary').style.display = 'block';
    document.getElementById('target-summary-rate').textContent = rate.toFixed(2) + '%';
    document.getElementById('target-summary-time').textContent = time + ' 年';
    
    // 设置复利频率显示文本
    const compoundText = document.getElementById('targetCompound').options[document.getElementById('targetCompound').selectedIndex].text;
    document.getElementById('target-summary-compound').textContent = compoundText;
    
    // 滚动到结果区域
    document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
    
    // 添加成功动画
    const resultCards = document.querySelectorAll('#target-mode .result-card');
    resultCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.transform = 'scale(1.02)';
            setTimeout(() => {
                card.style.transform = 'scale(1)';
            }, 200);
        }, index * 100);
    });
}

// 为新输入框添加事件监听
document.addEventListener('DOMContentLoaded', function() {
    const targetInputs = ['targetAmount', 'targetRate', 'targetTime'];
    targetInputs.forEach(id => {
        const input = document.getElementById(id);
        input.addEventListener('input', function(e) {
            // 清除错误信息
            clearErrors();
            
            // 防止负数
            if (this.value < 0) this.value = 0;
            
            // 实时验证
            validateTargetInput(id, this.value);
        });
        
        // 失去焦点时验证
        input.addEventListener('blur', function() {
            validateTargetInput(id, this.value);
        });
    });
    
    // 添加复利频率变化时的提示
    document.getElementById('targetCompound').addEventListener('change', function() {
        const compoundText = this.options[this.selectedIndex].text;
        showSuccess('target-compound', `已选择 ${compoundText}`);
    });
});

// 验证目标模式的单个输入
function validateTargetInput(id, value) {
    const numValue = parseFloat(value);
    
    switch(id) {
        case 'targetAmount':
            if (isNaN(numValue) || numValue <= 0) {
                showError('target-amount', '请输入有效的目标金额（大于0）');
            }
            break;
        case 'targetRate':
            if (isNaN(numValue) || numValue < 0) {
                showError('target-rate', '请输入有效的年利率（0或正数）');
            }
            break;
        case 'targetTime':
            if (isNaN(numValue) || numValue <= 0) {
                showError('target-time', '请输入有效的投资年限（大于0）');
            }
            break;
    }
}

// 清空所有输入和结果（增强版）
function clearAll() {
    const currentMode = getCurrentMode();
    
    if (currentMode === 'normal') {
        // 清空正向计算模式的输入
        document.getElementById('principal').value = '';
        document.getElementById('rate').value = '';
        document.getElementById('time').value = '';
        document.getElementById('compound').selectedIndex = 0;
    } else {
        // 清空目标计算模式的输入
        document.getElementById('targetAmount').value = '';
        document.getElementById('targetRate').value = '';
        document.getElementById('targetTime').value = '';
        document.getElementById('targetCompound').selectedIndex = 0;
    }
    
    // 清除错误信息
    clearErrors();
    
    // 隐藏结果
    document.getElementById('results').style.display = 'none';
    
    // 重置结果值
    document.getElementById('finalAmount').textContent = '¥0.00';
    document.getElementById('interestEarned').textContent = '¥0.00';
    document.getElementById('roi').textContent = '0.00%';
    document.getElementById('requiredPrincipal').textContent = '¥0.00';
    document.getElementById('targetFinalAmount').textContent = '¥0.00';
    document.getElementById('targetInterestEarned').textContent = '¥0.00';
    
    // 隐藏所有结果区域
    document.getElementById('normal-results').style.display = 'none';
    document.getElementById('target-results').style.display = 'none';
    
    // 添加清空动画
    const btn = document.getElementById('clear-btn');
    btn.style.transform = 'scale(0.95)';
    setTimeout(() => {
        btn.style.transform = 'scale(1)';
    }, 150);
    
    // 聚焦到当前模式的第一个输入框
    if (currentMode === 'normal') {
        document.getElementById('principal').focus();
    } else {
        document.getElementById('targetAmount').focus();
    }
}
