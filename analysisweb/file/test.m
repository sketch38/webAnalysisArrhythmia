clc

x = MLII;
y = zeros(21600,1);
figure; plot(x);

% lpf
for n=13:21600
   y(n) = 2*y(n-1)-y(n-2)+x(n)-2*x(n-6)+x(n-12); 
end

x2 = y;
y = zeros(21600,1);
% hpf
for n=33:21600
   y(n) = 32*x2(n-16)-(y(n-1)+x2(n)-x2(n-32));
end

x3 = y;
y = zeros(21600,1);
% derivative
for n=3:(21600-2)
   y(n) = (1/8)*(-x3(n-2)-2*x3(n-1)+2*x3(n+1)+x3(n+2));
end

% squaring
y = y.^2;

x3 = y;
y = zeros(21600,1);
N = 100;
% Moving-window integration
for n=(N-1):21600
    y(n)= (1/N)*sum(x3((n-(N-1)+1):n));
end

x4 = y;
y = zeros(21600,1);
% Rising Slop finding
for n=1:21600-3
    y(n)= x4(n+3)-x4(n);
end

%x5=y;
%y = zeros(21600,1);
%[pks,lc] = findpeaks(x5,21600);

x5=y;
%threshold1
signal = max(x5(1:2*200))*1/3; 
noise = mean(x5(1:2*200))*1/2;

%cut threshould
for n=1:21600
   if x5(n)<noise
       x5(n) = noise;
   end    
end

%find RR
count = 1;
for n=1:200:21400
    [maxP,loc]=max(x5(n:n+200),[],1);
    if maxP > 100
        rr(count,1)=maxP;
        rr(count,2)=loc+n;
        count=count+1;
    else
        continue
    end
    %disp(n);
end

index = 1;
for n=1:21600
    if n == rr(index,2)
        y2(n,1) = 1;
        if index >= 76
            index =1;
        else
            index = index+1;
        end
    else
        y2(n,1) = 0;
    end
end
   

