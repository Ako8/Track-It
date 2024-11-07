// SendEmail.js
class EmailService {
  constructor() {
    this.loadingSpinner = document.getElementById('loadingSpinner');
    this.alertMessage = document.getElementById('alertMessage');
    this.alertText = document.getElementById('alertText');
    this.submitBtn = document.getElementById('submitBtn');
    this.form = document.getElementById('contactForm');
  }

  // Show/hide loading spinner
  toggleLoading(show) {
    if (show) {
      this.loadingSpinner?.classList.remove('hidden');
      this.submitBtn.disabled = true;
    } else {
      this.loadingSpinner?.classList.add('hidden');
      this.submitBtn.disabled = false;
    }
  }

  // Show alert message
  showAlert(message, isSuccess = true) {
    this.alertMessage?.classList.remove('hidden');
    this.alertMessage?.classList.remove('bg-green-500', 'bg-red-500');
    this.alertMessage?.classList.add(isSuccess ? 'bg-green-500' : 'bg-red-500');
    if (this.alertText) {
      this.alertText.textContent = message;
    }

    setTimeout(() => {
      this.alertMessage?.classList.add('hidden');
    }, 3000);
  }

  // Get form data
  getFormData() {
    return {
      name: document.getElementById('name')?.value || '',
      email: document.getElementById('email')?.value || '',
      business: document.getElementById('business')?.value || '',
      message: document.getElementById('message')?.value || ''
    };
  }

  // Create email HTML template
  createEmailTemplate(data) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="text-align: center; padding: 20px 0; border-bottom: 2px solid #701EFC;">
          <h2 style="color: #701EFC; margin: 0;">New Contact Form Submission</h2>
        </div>
        
        <div style="padding: 20px 0;">
          <div style="margin-bottom: 20px;">
            <div style="font-weight: bold; color: #333;">Name:</div>
            <div style="margin-top: 5px; color: #666;">${data.name}</div>
          </div>
          
          <div style="margin-bottom: 20px;">
            <div style="font-weight: bold; color: #333;">Email:</div>
            <div style="margin-top: 5px; color: #666;">${data.email}</div>
          </div>
          
          <div style="margin-bottom: 20px;">
            <div style="font-weight: bold; color: #333;">Business:</div>
            <div style="margin-top: 5px; color: #666;">${data.business}</div>
          </div>
          
          <div style="margin-bottom: 20px;">
            <div style="font-weight: bold; color: #333;">Message:</div>
            <div style="margin-top: 5px; color: #666;">${data.message}</div>
          </div>
        </div>
        
        <div style="text-align: center; padding-top: 20px; border-top: 1px solid #eee; color: #888;">
          <p>This is an automated message from your website contact form.</p>
        </div>
      </div>
    `;
  }

  // Send email
  async sendEmail(e) {
    e.preventDefault();
    
    this.toggleLoading(true);
    const formData = this.getFormData();

    try {
      await Email.send({
        Host: emailConfig.smtpServer,
        Port: emailConfig.smtpPort,
        Username: emailConfig.smtpUsername,
        Password: emailConfig.smtpPassword,
        To: emailConfig.smtpUsername,
        From: formData.email,
        Subject: 'New Contact Form Submission',
        Body: this.createEmailTemplate(formData)
      });

      this.showAlert('Message sent successfully!', true);
      this.form?.reset();
    } catch (error) {
      console.error('Email sending failed:', error);
      this.showAlert('Failed to send message. Please try again.', false);
    } finally {
      this.toggleLoading(false);
    }
  }

  // Initialize event listeners
  init() {
    if (this.form) {
      this.form.addEventListener('submit', (e) => this.sendEmail(e));
    }
  }
}

// Initialize immediately
const emailService = new EmailService();
emailService.init();