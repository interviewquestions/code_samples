from django.shortcuts import render
import os
from django.core.servers.basehttp import FileWrapper
from django.http import HttpResponse
from ebook.models import BackgroundColor, Order, Downloaded
import hashlib


def home(request):
    return render(request, 'ebook/home.html')


def download(request, receipt):
    try:
        downloaded = Downloaded.objects.get(order__cbreceipt=receipt)
        if downloaded.count < 3:
            filename = "/opt/bitnami/apps/django/django_projects/Project/A Mountain of Junk Mail.pdf"
            wrapper = FileWrapper(file(filename))
            response = HttpResponse(wrapper, content_type='application/pdf')
            response['Content-Length'] = os.path.getsize(filename)
            downloaded.count += 1
            downloaded.save()
            return response
        else:
            return render(request, 'ebook/invalid.html')
    except Downloaded.DoesNotExist:
        return render(request, 'ebook/invalid.html')


def thank_you(request):
    receipt = request.REQUEST.get('cbreceipt')
    time = request.REQUEST.get('time')
    item = request.REQUEST.get('item')
    cbpop = request.REQUEST.get('cbpop')
    if valid_cb_pop(receipt, time, item, cbpop):
        new_order = request.REQUEST.dicts[1].dict()
        order, created = Order.objects.get_or_create(cbpop=new_order['cbpop'],
                        czip=new_order['czip'],
                        ccountry=new_order['ccountry'],
                        cbaffi=new_order['cbaffi'],
                        item=new_order['item'],
                        cname=new_order['cname'],
                        time=new_order['time'],
                        cbreceipt=new_order['cbreceipt'],
                        cemail=new_order['cemail'],
                        )
        downloaded, created = Downloaded.objects.get_or_create(order=order)
        return render(request, 'ebook/thank_you.html', {'thank_you': receipt})
    return render(request, 'ebook/nopurchase.html')


def valid_cb_pop(receipt, time, item, cbpop):
    secret_key = ''
    data = "%s|%s|%s|%s" % (secret_key, receipt, time, item)
    return cbpop == hashlib.sha1(data).hexdigest()[:8].upper()
