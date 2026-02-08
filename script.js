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
    document.getElementById('normal-results').style.display = 'block';
    document.getElementById('normal-result-title').innerHTML = '<span id="finalAmount">' + formatCurrency(finalAmount) + '</span>';
    document.getElementById('target-results').style.display = 'none';
    
    document.getElementById('finalAmount').textContent = formatCurrency(finalAmount);
    
    // 滚动到结果区域
    document.getElementById('normal-results').scrollIntoView({ behavior: 'smooth' });
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


// 添加页面加载完成后的初始化
document.addEventListener('DOMContentLoaded', function() {
    // 移除页面加载动画，避免手机上的闪烁
    document.body.style.opacity = '1';
    
    // 防止双击缩放
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function (event) {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);
    
    // 防止多点触控缩放
    document.addEventListener('gesturestart', function (event) {
        event.preventDefault();
    });
    
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

// 加减按钮功能
function adjustValue(inputId, step) {
    const input = document.getElementById(inputId);
    if (!input) return;
    
    let currentValue = parseFloat(input.value) || 0;
    let newValue;
    
    if (inputId === 'rate' || inputId === 'targetRate') {
        // 年利率：以1为倍数调整
        newValue = currentValue + step;
        if (newValue < 0) newValue = 0;
        input.value = newValue.toFixed(2);
    } else if (inputId === 'time' || inputId === 'targetTime') {
        // 投资年限：以1为倍数调整，必须是整数
        newValue = Math.max(0, Math.floor(currentValue) + step);
        input.value = newValue;
    } else if (inputId === 'principal') {
        // 本金：以10000为倍数调整
        newValue = Math.max(0, currentValue + (step * 10000));
        input.value = newValue;
    } else if (inputId === 'targetAmount') {
        // 目标金额：以100000为倍数调整
        newValue = Math.max(0, currentValue + (step * 100000));
        input.value = newValue;
    }
    
    // 触发输入事件，更新验证状态
    input.dispatchEvent(new Event('input', { bubbles: true }));
    
    // 如果在输入模式下，自动计算
    if (document.getElementById('normal-mode').style.display !== 'none' && 
        (inputId === 'rate' || inputId === 'time')) {
        calculate();
    } else if (document.getElementById('target-mode').style.display !== 'none' && 
               (inputId === 'targetRate' || inputId === 'targetTime')) {
        calculateTarget();
    }
}

// 为加减按钮添加触摸事件支持
document.addEventListener('DOMContentLoaded', function() {
    const stepperButtons = document.querySelectorAll('.stepper-btn');
    stepperButtons.forEach(button => {
        // 添加触摸开始事件，防止双击缩放
        button.addEventListener('touchstart', function(e) {
            e.preventDefault();
        }, { passive: false });
        
        // 添加触摸结束事件
        button.addEventListener('touchend', function(e) {
            e.preventDefault();
            // 获取按钮的onclick属性中的函数调用
            const onclickAttr = this.getAttribute('onclick');
            if (onclickAttr) {
                // 解析onclick属性，提取函数名和参数
                const match = onclickAttr.match(/adjustValue\('([^']+)'\s*,\s*(-?\d+)\)/);
                if (match) {
                    const inputId = match[1];
                    const step = parseInt(match[2]);
                    adjustValue(inputId, step);
                }
            }
        }, { passive: false });
    });
});

// 切换计算模式
function switchMode(mode) {
    const normalMode = document.getElementById('normal-mode');
    const targetMode = document.getElementById('target-mode');
    const normalResults = document.getElementById('normal-results');
    const targetResults = document.getElementById('target-results');
    
    if (mode === 'normal') {
        normalMode.style.display = 'flex';
        targetMode.style.display = 'none';
        normalResults.style.display = 'none';
        targetResults.style.display = 'none';
        clearErrors();
        clearResults();
    } else {
        normalMode.style.display = 'none';
        targetMode.style.display = 'flex';
        normalResults.style.display = 'none';
        targetResults.style.display = 'none';
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
    const finalAmountEl = document.getElementById('finalAmount');
    if (finalAmountEl) finalAmountEl.textContent = '¥0.00';
    
    // 清空目标计算结果
    const requiredPrincipalEl = document.getElementById('requiredPrincipal');
    if (requiredPrincipalEl) requiredPrincipalEl.textContent = '¥0.00';
    
    // 隐藏所有结果区域
    const normalResults = document.getElementById('normal-results');
    const targetResults = document.getElementById('target-results');
    if (normalResults) normalResults.style.display = 'none';
    if (targetResults) targetResults.style.display = 'none';
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
    const resultsDiv = document.getElementById('target-results');
    const resultTitle = document.getElementById('target-result-title');
    const requiredPrincipalSpan = document.getElementById('requiredPrincipal');
    
    if (resultsDiv) {
        resultsDiv.style.display = 'block';
    }
    if (resultTitle) {
        resultTitle.innerHTML = '<span id="requiredPrincipal">' + formatCurrency(requiredPrincipal) + '</span>';
    }
    if (requiredPrincipalSpan) {
        requiredPrincipalSpan.textContent = formatCurrency(requiredPrincipal);
    }
    
    // 滚动到结果区域
    if (resultsDiv) resultsDiv.scrollIntoView({ behavior: 'smooth' });
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

