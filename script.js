// Kiểm tra Ping bằng API của Cloudflare
async function checkPing() {
    const host = document.getElementById("pingHost").value;
    if (!host) {
        document.getElementById("pingResult").textContent = "❌ Vui lòng nhập địa chỉ!";
        return;
    }
    const startTime = Date.now();
    try {
        await fetch(`https://cloudflare.com/cdn-cgi/trace`);
        const ping = Date.now() - startTime;
        document.getElementById("pingResult").textContent = `✅ Ping: ${ping} ms`;
    } catch (error) {
        document.getElementById("pingResult").textContent = "❌ Không thể đo ping!";
    }
}

// Tra cứu DNS bằng API
async function lookupDNS() {
    const domain = document.getElementById("dnsHost").value;
    if (!domain) {
        document.getElementById("dnsResult").textContent = "❌ Vui lòng nhập tên miền!";
        return;
    }
    try {
        const response = await fetch(`https://dns.google/resolve?name=${domain}`);
        const data = await response.json();
        if (data.Answer) {
            document.getElementById("dnsResult").textContent = `✅ IP: ${data.Answer[0].data}`;
        } else {
            document.getElementById("dnsResult").textContent = "❌ Không tìm thấy dữ liệu DNS!";
        }
    } catch (error) {
        document.getElementById("dnsResult").textContent = "❌ Lỗi khi tra cứu DNS!";
    }
}

// Kiểm tra tốc độ tải xuống
async function testSpeed() {
    const fileUrl = "https://speed.hetzner.de/100MB.bin"; // File test tốc độ
    const startTime = Date.now();
    try {
        const response = await fetch(fileUrl);
        if (!response.ok) throw new Error("Không thể tải file");

        const reader = response.body.getReader();
        let receivedBytes = 0;

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            receivedBytes += value.length;
        }

        const endTime = Date.now();
        const timeTaken = (endTime - startTime) / 1000;
        const speedMbps = ((receivedBytes * 8) / timeTaken / 1e6).toFixed(2);
        
        document.getElementById("speedResult").textContent = `✅ Tốc độ: ${speedMbps} Mbps`;
    } catch (error) {
        document.getElementById("speedResult").textContent = "❌ Lỗi kiểm tra tốc độ!";
    }
}
