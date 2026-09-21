import React, { useState } from 'react';
import { 
  Star, 
  ThumbsUp, 
  CheckCircle2, 
  MessageCircle, 
  Plus, 
  Filter, 
  Sparkles,
  X
} from 'lucide-react';
import { Review, VehicleType } from '../../types';
import { INITIAL_REVIEWS, VEHICLE_OPTIONS, WASH_PACKAGES } from '../../data/packages';

export interface ReviewsSectionProps {
  onAddReviewSuccess?: () => void;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = () => {
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTagFilter, setSelectedTagFilter] = useState<string>('all');

  // New review form states
  const [formName, setFormName] = useState('');
  const [formRating, setFormRating] = useState(5);
  const [formVehicle, setFormVehicle] = useState<VehicleType>('sedan');
  const [formPackage, setFormPackage] = useState('Ceramic Shield Pro');
  const [formComment, setFormComment] = useState('');
  const [formTags, setFormTags] = useState<string[]>(['Liquid Glass Shine']);

  const allAvailableTags = [
    'Liquid Glass Shine', 
    'Hydrophobic Finish', 
    'App Live Tracker', 
    'Showroom Fresh', 
    'Ozone Treatment', 
    'Mud Removal', 
    'No Swirl Marks',
    'Fast Turnaround'
  ];

  const handleLike = (reviewId: string) => {
    setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, likes: r.likes + 1 } : r));
  };

  const handleToggleTag = (tag: string) => {
    if (formTags.includes(tag)) {
      setFormTags(formTags.filter(t => t !== tag));
    } else {
      setFormTags([...formTags, tag]);
    }
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formComment.trim()) return;

    const newReview: Review = {
      id: 'rev-' + Date.now(),
      customerName: formName,
      rating: formRating,
      date: 'Just now',
      vehicleType: formVehicle,
      packageName: formPackage,
      comment: formComment,
      tags: formTags.length > 0 ? formTags : ['Verified Wash'],
      verifiedWash: true,
      avatarBg: 'bg-cyan-600',
      likes: 1
    };

    setReviews([newReview, ...reviews]);
    setIsModalOpen(false);
    setFormName('');
    setFormComment('');
  };

  const filteredReviews = selectedTagFilter === 'all' 
    ? reviews 
    : reviews.filter(r => r.tags.includes(selectedTagFilter));

  const averageRating = (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1);

  return (
    <div id="reviews-section-container" className="space-y-6">
      {/* Header & Score Metrics Overview */}
      <div className="bg-slate-900/90 border border-slate-800/90 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                Verified Wash Experiences
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
              Customer Satisfaction & Shine Ratings
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-xl">
              Authentic reviews from drivers who tested our 3D tracking, microfiber roller treatment, and graphene ceramic armor.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-950/80 border border-slate-800/90 rounded-2xl p-4 sm:p-5 flex-shrink-0">
            <div className="text-center pr-4 border-r border-slate-800">
              <span className="text-3xl sm:text-4xl font-black text-white font-display">
                {averageRating}
              </span>
              <div className="flex items-center gap-1 text-amber-400 mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <span className="text-[10px] text-slate-400 block mt-1">out of 5.0 stars</span>
            </div>

            <div className="space-y-1 text-xs">
              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-400">Swirl-Free Finish:</span>
                <span className="font-semibold text-emerald-400">99.8%</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-400">Speed & Promptness:</span>
                <span className="font-semibold text-cyan-400">4.9/5</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-400">Staff Friendliness:</span>
                <span className="font-semibold text-indigo-400">5.0/5</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filter tags & Write Review button */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-6 mt-6 border-t border-slate-800/80">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            <button
              onClick={() => setSelectedTagFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                selectedTagFilter === 'all'
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800'
              }`}
            >
              All Reviews ({reviews.length})
            </button>
            {allAvailableTags.slice(0, 4).map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTagFilter(tag)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                  selectedTagFilter === tag
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          <button
            id="btn-open-review-modal"
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            Write a Review
          </button>
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredReviews.map((review) => (
          <div
            key={review.id}
            id={`review-card-${review.id}`}
            className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700 transition-all space-y-3 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2.5">
                  <div className={`w-9 h-9 rounded-full ${review.avatarBg} text-white flex items-center justify-center font-bold text-sm`}>
                    {review.customerName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                      {review.customerName}
                      {review.verifiedWash && (
                        <span className="flex items-center gap-0.5 text-[10px] text-cyan-400 font-normal bg-cyan-500/10 px-1.5 py-0.5 rounded-full border border-cyan-500/20">
                          <CheckCircle2 className="w-2.5 h-2.5" /> Verified Wash
                        </span>
                      )}
                    </h4>
                    <span className="text-[11px] text-slate-400">
                      {review.packageName} • {review.date}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-0.5 text-amber-400">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                "{review.comment}"
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs">
              <div className="flex items-center gap-1.5 flex-wrap">
                {review.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-lg bg-slate-800 text-slate-400 text-[10px]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <button
                onClick={() => handleLike(review.id)}
                className="flex items-center gap-1 text-slate-400 hover:text-cyan-400 transition-colors py-1 px-2 rounded-lg hover:bg-slate-800/60"
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span className="text-xs">{review.likes}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Review Modal */}
      {isModalOpen && (
        <div id="review-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white font-display mb-1">Share Your Experience</h3>
            <p className="text-xs text-slate-400 mb-5">
              Help other drivers discover the best treatment for their vehicle.
            </p>

            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Jordan Miller"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Vehicle Type</label>
                  <select
                    value={formVehicle}
                    onChange={(e) => setFormVehicle(e.target.value as VehicleType)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    {VEHICLE_OPTIONS.map((v) => (
                      <option key={v.id} value={v.id}>{v.name.split('/')[0]}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Package Received</label>
                  <select
                    value={formPackage}
                    onChange={(e) => setFormPackage(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    {WASH_PACKAGES.map((p) => (
                      <option key={p.id} value={p.name}>{p.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Overall Rating</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      type="button"
                      key={s}
                      onClick={() => setFormRating(s)}
                      className="p-1 text-amber-400 hover:scale-110 transition-transform"
                    >
                      <Star className={`w-6 h-6 ${s <= formRating ? 'fill-current' : 'text-slate-600'}`} />
                    </button>
                  ))}
                  <span className="text-xs text-slate-400 ml-2">{formRating} of 5 stars</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Highlight Tags</label>
                <div className="flex flex-wrap gap-1.5">
                  {allAvailableTags.map((tag) => (
                    <button
                      type="button"
                      key={tag}
                      onClick={() => handleToggleTag(tag)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                        formTags.includes(tag)
                          ? 'bg-cyan-500 text-slate-950 font-bold'
                          : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Detailed Review</label>
                <textarea
                  required
                  rows={3}
                  value={formComment}
                  onChange={(e) => setFormComment(e.target.value)}
                  placeholder="How did the car turn out? Did you like the 3D wash tracker?"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors shadow-lg"
              >
                Submit Verified Review
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
