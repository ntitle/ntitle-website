class PrizeForm {
    constructor() {
        this.newsletterFormUrl = 'https://network.us17.list-manage.com/subscribe/post-json?u=38836b86bdc2b88a242addc37&id=1bf326666b';
        this.codeApiUrl = 'http://localhost:8888/codes/assign';
        this.formSubmitted = false;
        this.newsletterEmailValid = undefined;
        this.code = '';
        this.email = '';
        this.codeStatus = {};
    }

    init() {
        this.form = document.querySelector('.prize-form');
        this.emailInput = document.querySelector('.prize-form__email');
        this.codeInput = document.querySelector('.prize-form__code');
        this.message = document.querySelector('.prize-form__message-container');
        this.checkbox = document.querySelector('.prize-form__terms');

        console.log('checkbox', this.checkbox);

        this.form.addEventListener('submit', (e) => this.onFormSubmit(e));
    }

    onFormSubmit(e) {
        e.preventDefault();
        e.stopPropagation();

        this.email = this.emailInput.value;
        this.code = this.codeInput.value;

        this.message.innerHTML = '';

        this.submitCode();
    }

    signToNewsletter() {
        return $.ajax({
            type: 'GET',
            url: this.newsletterFormUrl,
            data: {
                EMAIL: this.email,
            },
            cache: false,
            dataType: 'jsonp',
            jsonp: 'c', // trigger MailChimp to return a JSONP response
            contentType: 'application/json; charset=utf-8',
        });

    }

    submitCode() {
        this.callCodeApi()
            .done(data => {
                this.codeStatus = data;

                if (this.codeStatus.redeemed) {
                    this.showMessage('Sorry, this code has been used', 'error');
                    return;
                } else {
                    this.showMessage(`Congratulations! You have won ${this.codeStatus.ntl} NTL! (1 NTL = 0.10 USD)`, 'success')
                    this.showMessage(`To claim your prize, please check the email we sent with further instructions.`, 'success')
                    this.showMessage(`If you do not receive an email contact us at contact@ntitle.network. But first, please make sure you check your spam folder.`, 'success')
                }

                this.signToNewsletter()
                    .done(status => {
                        if (status.result === 'error') {
                            this.newsletterEmailValid = false;
                            this.showMessage('Email can\'t be submitted to newsletter. Maybe you are already signed?', 'error');

                        } else {
                            this.newsletterEmailValid = true;
                            this.showMessage('Email has been submitted, check your inbox', 'success');

                        }

                    }).fail(err => {

                    this.showMessage('Email can\'t be submitted to newsletter. Maybe you are already signed?', 'error');
                });
            })
            .fail( (xhr) => {
                if(xhr.status === 404) {
                    this.showMessage('Sorry, code not valid', 'error');
                } else {
                    this.showMessage('Something went wrong, try again later', 'error');
                }

            });

    }

    callCodeApi() {
        return $.ajax({
            type: 'POST',
            contentType: "application/json",
            data: JSON.stringify({
                code: this.code,
                email: this.email,
            }),
            url: this.codeApiUrl
        });
    }

    showMessage(message, type) {
        const el = document.createElement('p');
        el.classList.add('prize-form__message');
        el.classList.add(`prize-form__message--${type}`);
        el.textContent = message;
        this.message.appendChild(el)
    }


}

if (document.querySelector('.prize-form')) {
    const form = new PrizeForm();
    form.init();
}
