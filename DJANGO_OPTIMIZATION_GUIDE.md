# Django API Performance Optimization Guide

## 🚀 Current Bottlenecks

1. **Base64 Images in API Response** - HUGE bottleneck (can be 2-5MB per response)
2. **No Backend Caching** - Every request hits the database
3. **PythonAnywhere** - Free tier has limitations

**API Base URL:** `https://backendbadminton.pythonanywhere.com/api/`

## ✅ Solution 1: Fix Image Serving (BIGGEST IMPACT)

### Problem: Base64 images in JSON make responses massive (2-5MB)

### Solution: Return Image URLs Instead

**In your Django serializers, change:**

```python
# OLD (BAD) - Returns base64 in JSON
class CompletedEventSerializer(serializers.ModelSerializer):
    poster = serializers.SerializerMethodField()
    
    def get_poster(self, obj):
        if obj.poster:
            with open(obj.poster.path, 'rb') as f:
                import base64
                return base64.b64encode(f.read()).decode()
        return None

# NEW (GOOD) - Returns URL
class CompletedEventSerializer(serializers.ModelSerializer):
    poster = serializers.SerializerMethodField()
    
    def get_poster(self, obj):
        if obj.poster:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.poster.url)
            return obj.poster.url
        return None

    class Meta:
        model = CompletedEvent
        fields = ['id', 'event_name', 'event_conducted_date', 'poster', 'created_at']
```

**In your ViewSet, add request context:**

```python
class CompletedEventViewSet(viewsets.ModelViewSet):
    queryset = CompletedEvent.objects.all()
    serializer_class = CompletedEventSerializer
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context
```

**Impact:** Reduces API response from 2-5MB to ~5-10KB (99% reduction!)

**Example API Response:**
```json
{
  "id": 1,
  "event_name": "Badminton Championship",
  "poster": "https://backendbadminton.pythonanywhere.com/media/posters/event1.jpg"
}
```

---

## ✅ Solution 2: Add Backend Caching

### Option A: Simple In-Memory Caching (Free, Easy)

```python
# settings.py
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
        'LOCATION': 'unique-snowflake',
    }
}

# views.py
from django.core.cache import cache
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response

class CompletedEventViewSet(ModelViewSet):
    queryset = CompletedEvent.objects.all()
    serializer_class = CompletedEventSerializer
    
    def list(self, request, *args, **kwargs):
        cache_key = 'completed_events_list'
        cached_data = cache.get(cache_key)
        
        if cached_data is None:
            queryset = self.filter_queryset(self.get_queryset())
            serializer = self.get_serializer(queryset, many=True)
            cached_data = serializer.data
            cache.set(cache_key, cached_data, timeout=60 * 15)  # 15 minutes
        
        return Response(cached_data)
```

### Option B: Redis Caching (Best Performance)

**Free Redis Options:**
1. **Upstash Redis** - Free tier (10K requests/day)
2. **Redis Cloud** - Free tier (30MB)

```python
# Install
pip install django-redis

# settings.py
CACHES = {
    'default': {
        'BACKEND': 'django_redis.cache.RedisCache',
        'LOCATION': 'redis://your-redis-url:6379/1',
        'OPTIONS': {
            'CLIENT_CLASS': 'django_redis.client.DefaultClient',
        }
    }
}
```

---

## ✅ Solution 3: Optimize Database Queries

```python
# Use select_related and prefetch_related to reduce queries
class CompletedEventViewSet(ModelViewSet):
    def get_queryset(self):
        return CompletedEvent.objects.select_related().all()
    
    # Use only() to fetch only needed fields
    def list(self, request):
        events = CompletedEvent.objects.only(
            'id', 'event_name', 'event_conducted_date', 'poster'
        )
        serializer = self.get_serializer(events, many=True)
        return Response(serializer.data)
```

---

## ✅ Solution 4: Use DRF-Extensions for Easy Caching

```python
# Install
pip install drf-extensions

# views.py
from rest_framework_extensions.cache.mixins import CacheResponseMixin
from rest_framework_extensions.cache.decorators import cache_response

class CompletedEventViewSet(CacheResponseMixin, ModelViewSet):
    queryset = CompletedEvent.objects.all()
    serializer_class = CompletedEventSerializer
    # Automatically caches for 15 minutes
```

---

## 🌐 Solution 5: Free Hosting Alternatives

### Option A: Render (Better than PythonAnywhere)
- **Free tier:** 750 hours/month
- **Faster:** Better infrastructure
- **Auto-deploy:** From GitHub
- **URL:** https://render.com

### Option B: Railway (Fastest Free Option)
- **Free tier:** $5 credit/month
- **Very fast:** Modern infrastructure
- **Auto-deploy:** From GitHub
- **URL:** https://railway.app

### Option C: Fly.io (Good Performance)
- **Free tier:** 3 shared VMs
- **Global:** Edge locations
- **URL:** https://fly.io

### Option D: Keep PythonAnywhere + Optimize
- Add Redis caching (Upstash free tier)
- Optimize images (return URLs)
- Add query optimization

---

## 📊 Performance Comparison

| Optimization | Impact | Difficulty | Cost |
|-------------|--------|------------|------|
| **Return Image URLs** | 🔥🔥🔥 99% faster | Easy | Free |
| **Backend Caching** | 🔥🔥 80% faster | Easy | Free |
| **Query Optimization** | 🔥 30% faster | Medium | Free |
| **Redis Caching** | 🔥🔥 90% faster | Medium | Free tier |
| **Better Hosting** | 🔥 40% faster | Easy | Free |

---

## 🎯 Recommended Action Plan

1. **IMMEDIATE (Biggest Impact):**
   - ✅ Change serializers to return image URLs instead of base64
   - ✅ Add simple in-memory caching

2. **SHORT TERM:**
   - ✅ Optimize database queries
   - ✅ Consider migrating to Railway/Render

3. **LONG TERM:**
   - ✅ Set up Redis caching (Upstash free tier)
   - ✅ Use CDN for images (Cloudinary free tier)

---

## 💡 Quick Win: Image URL Fix

This single change will make your API **10-100x faster**:

```python
# In your serializer
def get_poster(self, obj):
    if obj.poster:
        return self.context['request'].build_absolute_uri(obj.poster.url)
    return None
```

Instead of returning 2MB base64 string, return a URL like:
`https://backendbadminton.pythonanywhere.com/media/posters/event1.jpg`

**API Endpoints:**
- Events: `https://backendbadminton.pythonanywhere.com/api/events/`
- Completed Events: `https://backendbadminton.pythonanywhere.com/api/completed-events/`
- Event Results: `https://backendbadminton.pythonanywhere.com/api/event-results/`
- Registrations: `https://backendbadminton.pythonanywhere.com/api/registrations/`

